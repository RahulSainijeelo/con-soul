"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { Loader2, Upload, X, CreditCard, Shield, CheckCircle2, IndianRupee } from "lucide-react";
import { uploadImageToImgBB } from "@/lib/imgbb";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface JoinTripFormProps {
    tripId: string;
    tripTitle: string;
    tripPrice: number;
    userEmail?: string;
    mode?: string; // "bus" or "train"
    price_3ac?: number;
    price_sleeper?: number;
    registrationAmount?: number;
}

declare global {
    interface Window {
        Razorpay: any;
    }
}

export default function JoinTripForm({
    tripId,
    tripTitle,
    tripPrice,
    userEmail = "",
    mode,
    price_3ac,
    price_sleeper,
    registrationAmount,
}: JoinTripFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [uploadingAadhaar, setUploadingAadhaar] = useState(false);
    const [paymentStep, setPaymentStep] = useState(false); // true = show payment confirmation

    const [formData, setFormData] = useState({
        fullName: "",
        aadhaarNo: "",
        mobileNo: "",
        email: userEmail,
        aadhaarImage: "",
        transportMode: mode === "train" ? "3ac" : "",
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    // Calculate total amount based on mode
    const getTotalAmount = (): number => {
        if (mode === "train") {
            if (formData.transportMode === "3ac" && price_3ac) {
                return price_3ac;
            } else if (formData.transportMode === "sleeper" && price_sleeper) {
                return price_sleeper;
            }
            return price_sleeper || tripPrice;
        }
        return tripPrice;
    };

    // Amount to charge now (registration or full)
    const getPayableAmount = (): number => {
        const total = getTotalAmount();
        if (registrationAmount && registrationAmount < total) {
            return registrationAmount;
        }
        return total;
    };

    const isPartialPayment = (): boolean => {
        const total = getTotalAmount();
        return !!(registrationAmount && registrationAmount < total);
    };

    // Load Razorpay script dynamically
    const loadRazorpayScript = (): Promise<boolean> => {
        return new Promise((resolve) => {
            if (window.Razorpay) {
                resolve(true);
                return;
            }
            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: "" }));
        }
    };

    const handleTransportModeChange = (value: string) => {
        setFormData((prev) => ({ ...prev, transportMode: value }));
        if (errors.transportMode) {
            setErrors((prev) => ({ ...prev, transportMode: "" }));
        }
    };

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.fullName.trim()) {
            newErrors.fullName = "Full name is required";
        } else if (formData.fullName.trim().length < 3) {
            newErrors.fullName = "Name must be at least 3 characters";
        }

        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = "Invalid email format";
        }

        if (!formData.mobileNo.trim()) {
            newErrors.mobileNo = "Mobile number is required";
        } else if (!/^\d{10}$/.test(formData.mobileNo)) {
            newErrors.mobileNo = "Mobile number must be exactly 10 digits";
        }

        if (!formData.aadhaarNo.trim()) {
            newErrors.aadhaarNo = "Aadhaar number is required";
        } else if (!/^\d{12}$/.test(formData.aadhaarNo)) {
            newErrors.aadhaarNo = "Aadhaar number must be exactly 12 digits";
        }

        if (mode === "train" && !formData.transportMode) {
            newErrors.transportMode = "Please select a travel class";
        }

        if (!formData.aadhaarImage) {
            newErrors.aadhaarImage = "Please upload Aadhaar card image";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleImageUpload = async (
        e: React.ChangeEvent<HTMLInputElement>,
        setUploading: (val: boolean) => void
    ) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        try {
            const result = await uploadImageToImgBB(file);
            setFormData((prev) => ({ ...prev, aadhaarImage: result.url }));
            if (errors.aadhaarImage) {
                setErrors((prev) => ({ ...prev, aadhaarImage: "" }));
            }
            toast({
                title: "Image Uploaded",
                description: "Aadhaar card uploaded successfully",
            });
        } catch (error) {
            toast({
                title: "Upload Failed",
                description: "Failed to upload image. Please try again.",
                variant: "destructive",
            });
        } finally {
            setUploading(false);
        }
    };

    const removeImage = () => {
        setFormData((prev) => ({ ...prev, aadhaarImage: "" }));
    };

    const handleProceedToPayment = async () => {
        if (!validateForm()) {
            toast({
                title: "Validation Failed",
                description: "Please fix the errors in the form",
                variant: "destructive",
            });
            return;
        }
        setPaymentStep(true);
    };

    const handleRazorpayPayment = async () => {
        setLoading(true);

        try {
            // Load Razorpay script
            const loaded = await loadRazorpayScript();
            if (!loaded) {
                throw new Error("Razorpay SDK failed to load. Check your internet connection.");
            }

            const totalAmount = getTotalAmount();
            const payableAmount = getPayableAmount();

            // Step 1: Create Razorpay order on backend
            const orderRes = await fetch("/api/razorpay/order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ amount: payableAmount, tripId }),
            });

            const orderData = await orderRes.json();

            if (!orderRes.ok) {
                throw new Error(orderData.error || "Failed to create payment order");
            }

            // Step 2: Open Razorpay checkout
            await new Promise<void>((resolve, reject) => {
                const options = {
                    key: orderData.keyId,
                    amount: orderData.amount,
                    currency: orderData.currency,
                    name: "Con-Soul",
                    description: `Booking for ${tripTitle}`,
                    order_id: orderData.orderId,
                    prefill: {
                        name: formData.fullName,
                        email: formData.email,
                        contact: formData.mobileNo,
                    },
                    theme: {
                        color: "#D4AF37",
                    },
                    handler: async (response: {
                        razorpay_payment_id: string;
                        razorpay_order_id: string;
                        razorpay_signature: string;
                    }) => {
                        try {
                            // Step 3: Verify payment and create booking
                            const { transportMode, ...restFormData } = formData;

                            const bookingPayload: any = {
                                tripId,
                                ...restFormData,
                                amount: totalAmount,
                                amountPaid: payableAmount,
                                razorpayPaymentId: response.razorpay_payment_id,
                                razorpayOrderId: response.razorpay_order_id,
                                razorpaySignature: response.razorpay_signature,
                            };

                            if (mode === "train" && transportMode) {
                                bookingPayload.transportMode = transportMode;
                            }

                            const bookingRes = await fetch("/api/bookings", {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify(bookingPayload),
                            });

                            const bookingData = await bookingRes.json();

                            if (!bookingRes.ok) {
                                throw new Error(bookingData.error || "Failed to create booking");
                            }

                            toast({
                                title: "🎉 Booking Confirmed!",
                                description: `Payment successful! Booking ID: ${bookingData.id}`,
                            });

                            resolve();
                            router.push("/my-trips");
                        } catch (err) {
                            reject(err);
                        }
                    },
                    modal: {
                        ondismiss: () => {
                            reject(new Error("Payment cancelled by user"));
                        },
                    },
                };

                const rzp = new window.Razorpay(options);
                rzp.on("payment.failed", (response: any) => {
                    reject(new Error(response.error?.description || "Payment failed"));
                });
                rzp.open();
            });
        } catch (error) {
            const errMsg = error instanceof Error ? error.message : "Something went wrong";
            if (errMsg !== "Payment cancelled by user") {
                toast({
                    title: "Payment Failed",
                    description: errMsg,
                    variant: "destructive",
                });
            } else {
                toast({
                    title: "Payment Cancelled",
                    description: "You cancelled the payment. Your booking was not created.",
                });
            }
            setPaymentStep(false);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Form Section */}
            <div className="space-y-6">
                <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle className="text-gold">Personal Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <Label htmlFor="fullName" className="text-gray-300">Full Name</Label>
                            <Input
                                id="fullName"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleInputChange}
                                className={`bg-black/50 border-white/10 text-white mt-1 ${errors.fullName ? 'border-red-500' : ''}`}
                                placeholder="As per Aadhaar"
                                required
                                disabled={paymentStep}
                            />
                            {errors.fullName && (
                                <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>
                            )}
                        </div>

                        <div>
                            <Label htmlFor="email" className="text-gray-300">Email</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                className={`bg-black/50 border-white/10 text-white mt-1 ${errors.email ? 'border-red-500' : ''}`}
                                required
                                disabled={paymentStep}
                            />
                            {errors.email && (
                                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="mobileNo" className="text-gray-300">Mobile Number</Label>
                                <Input
                                    id="mobileNo"
                                    name="mobileNo"
                                    value={formData.mobileNo}
                                    onChange={handleInputChange}
                                    className={`bg-black/50 border-white/10 text-white mt-1 ${errors.mobileNo ? 'border-red-500' : ''}`}
                                    placeholder="10 digits"
                                    pattern="\d{10}"
                                    required
                                    disabled={paymentStep}
                                />
                                {errors.mobileNo && (
                                    <p className="text-red-500 text-sm mt-1">{errors.mobileNo}</p>
                                )}
                            </div>
                            <div>
                                <Label htmlFor="aadhaarNo" className="text-gray-300">Aadhaar Number</Label>
                                <Input
                                    id="aadhaarNo"
                                    name="aadhaarNo"
                                    value={formData.aadhaarNo}
                                    onChange={handleInputChange}
                                    className={`bg-black/50 border-white/10 text-white mt-1 ${errors.aadhaarNo ? 'border-red-500' : ''}`}
                                    placeholder="12 digits"
                                    pattern="\d{12}"
                                    required
                                    disabled={paymentStep}
                                />
                                {errors.aadhaarNo && (
                                    <p className="text-red-500 text-sm mt-1">{errors.aadhaarNo}</p>
                                )}
                            </div>
                        </div>

                        {/* Transport Mode Dropdown - Only for Train */}
                        {mode === "train" && (
                            <div>
                                <Label htmlFor="transportMode" className="text-gray-300">Travel Class</Label>
                                <Select
                                    value={formData.transportMode}
                                    onValueChange={handleTransportModeChange}
                                    disabled={paymentStep}
                                >
                                    <SelectTrigger className={`bg-black/50 border-white/10 text-white mt-1 ${errors.transportMode ? 'border-red-500' : ''}`}>
                                        <SelectValue placeholder="Select travel class" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-black border-white/10">
                                        <SelectItem value="3ac" className="text-white hover:bg-white/10">
                                            3AC {price_3ac && `- ₹${price_3ac.toLocaleString()}`}
                                        </SelectItem>
                                        <SelectItem value="sleeper" className="text-white hover:bg-white/10">
                                            Sleeper {price_sleeper && `- ₹${price_sleeper.toLocaleString()}`}
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.transportMode && (
                                    <p className="text-red-500 text-sm mt-1">{errors.transportMode}</p>
                                )}
                            </div>
                        )}

                        <div>
                            <Label className="text-gray-300">Upload Aadhaar Card</Label>
                            {errors.aadhaarImage && (
                                <p className="text-red-500 text-sm mt-1">{errors.aadhaarImage}</p>
                            )}
                            <div className="mt-2">
                                {formData.aadhaarImage ? (
                                    <div className="relative group w-full h-48 bg-black/50 rounded-lg border border-white/10 overflow-hidden">
                                        <img
                                            src={formData.aadhaarImage}
                                            alt="Aadhaar"
                                            className="w-full h-full object-contain"
                                        />
                                        {!paymentStep && (
                                            <Button
                                                type="button"
                                                variant="destructive"
                                                size="sm"
                                                onClick={removeImage}
                                                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        )}
                                    </div>
                                ) : (
                                    <div className="relative">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => handleImageUpload(e, setUploadingAadhaar)}
                                            disabled={uploadingAadhaar || paymentStep}
                                            className="hidden"
                                            id="aadhaar-upload"
                                        />
                                        <label
                                            htmlFor="aadhaar-upload"
                                            className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-white/20 rounded-lg cursor-pointer hover:border-gold transition-colors ${uploadingAadhaar ? 'opacity-50' : ''}`}
                                        >
                                            {uploadingAadhaar ? (
                                                <Loader2 className="h-8 w-8 text-gold animate-spin" />
                                            ) : (
                                                <>
                                                    <Upload className="h-8 w-8 text-gray-400 mb-2" />
                                                    <span className="text-sm text-gray-400">Click to upload Aadhaar</span>
                                                </>
                                            )}
                                        </label>
                                    </div>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Payment Section */}
            <div className="space-y-6">
                <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle className="text-gold flex items-center gap-2">
                            <CreditCard className="h-5 w-5" />
                            Payment Summary
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Amount Display */}
                        <div className="bg-gradient-to-br from-gold/10 to-yellow-900/10 p-6 rounded-xl border border-gold/20 text-center">
                            {isPartialPayment() ? (
                                <>
                                    <p className="text-gray-400 mb-1 text-xs uppercase tracking-wide">Total Trip Price</p>
                                    <p className="text-2xl font-semibold text-gray-300 line-through mb-3">₹{getTotalAmount().toLocaleString()}</p>
                                    <p className="text-gold mb-2 text-sm uppercase tracking-wide font-semibold">Pay Now — Registration Fee</p>
                                    <div className="flex items-center justify-center gap-1">
                                        <IndianRupee className="h-8 w-8 text-gold" />
                                        <p className="text-5xl font-bold text-gold">{getPayableAmount().toLocaleString()}</p>
                                    </div>
                                    <div className="mt-3 p-2 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                                        <p className="text-blue-300 text-sm">Remaining ₹{(getTotalAmount() - getPayableAmount()).toLocaleString()} payable later from My Trips</p>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <p className="text-gray-400 mb-2 text-sm uppercase tracking-wide">Total Amount to Pay</p>
                                    <div className="flex items-center justify-center gap-1">
                                        <IndianRupee className="h-8 w-8 text-gold" />
                                        <p className="text-5xl font-bold text-gold">{getTotalAmount().toLocaleString()}</p>
                                    </div>
                                </>
                            )}
                            {mode === "train" && formData.transportMode && (
                                <p className="text-sm text-gray-400 mt-2">
                                    ({formData.transportMode === "3ac" ? "3AC" : "Sleeper"} Class)
                                </p>
                            )}
                        </div>

                        {/* Payment Info */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-3 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                                <Shield className="h-5 w-5 text-blue-400 flex-shrink-0" />
                                <div>
                                    <p className="text-white text-sm font-medium">Secure Payment via Razorpay</p>
                                    <p className="text-gray-400 text-xs">Your payment is protected by 256-bit SSL encryption</p>
                                </div>
                            </div>

                            <div className="space-y-2 text-sm">
                                <div className="flex items-center gap-2 text-gray-400">
                                    <CheckCircle2 className="h-4 w-4 text-green-400" />
                                    <span>UPI, Net Banking, Credit/Debit Cards accepted</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-400">
                                    <CheckCircle2 className="h-4 w-4 text-green-400" />
                                    <span>Instant payment confirmation</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-400">
                                    <CheckCircle2 className="h-4 w-4 text-green-400" />
                                    <span>Booking ID sent to your email</span>
                                </div>
                            </div>
                        </div>

                        {/* Booking summary */}
                        <div className="bg-black/30 rounded-lg border border-white/5 p-4 space-y-2 text-sm">
                            <p className="text-gray-400 font-medium mb-3">Booking for: <span className="text-white">{tripTitle}</span></p>
                            {formData.fullName && (
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Name</span>
                                    <span className="text-white">{formData.fullName}</span>
                                </div>
                            )}
                            {formData.email && (
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Email</span>
                                    <span className="text-white">{formData.email}</span>
                                </div>
                            )}
                            {formData.mobileNo && (
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Mobile</span>
                                    <span className="text-white">{formData.mobileNo}</span>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Action Buttons */}
            <div className="lg:col-span-2 flex justify-end gap-4">
                {paymentStep ? (
                    <>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setPaymentStep(false)}
                            disabled={loading}
                            className="border-white/10 text-gray-400 hover:text-white"
                        >
                            Edit Details
                        </Button>
                        <Button
                            onClick={handleRazorpayPayment}
                            disabled={loading}
                            className="bg-gold hover:bg-yellow-600 text-black font-bold text-lg px-8 py-6"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                    Processing Payment...
                                </>
                            ) : (
                                <>
                                    <CreditCard className="mr-2 h-5 w-5" />
                                    Pay ₹{getPayableAmount().toLocaleString()}
                                    {isPartialPayment() && <span className="ml-1 text-sm font-normal">(Registration)</span>}
                                </>
                            )}
                        </Button>
                    </>
                ) : (
                    <Button
                        onClick={handleProceedToPayment}
                        disabled={uploadingAadhaar}
                        className="bg-gold hover:bg-yellow-600 text-black font-bold text-lg px-8 py-6 w-full md:w-auto"
                    >
                        {uploadingAadhaar ? (
                            <>
                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                Uploading...
                            </>
                        ) : (
                            "Proceed to Payment"
                        )}
                    </Button>
                )}
            </div>
        </div>
    );
}
