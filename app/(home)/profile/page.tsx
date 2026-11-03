"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import BottomTabBar from "@/components/layout/BottomTabBar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
    User,
    Mail,
    Phone,
    LogOut,
    Edit2,
    Save,
    X,
    ChevronRight,
    Shield,
    Info,
    FileText,
    Camera,
    Loader2,
    ShieldAlert,
    GraduationCap,
    Upload,
    CheckCircle2,
    Clock,
    XCircle,
    ArrowRight,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { uploadImageToImgBB } from "@/lib/imgbb";
import LoginTC from "@/components/auth/LoginTC";
import type { AmbassadorApplication, AmbassadorApplicationStatus } from "@/types/Ambassador";

interface UserProfile {
    name: string;
    email: string;
    number: string;
    image: string;
}

export default function ProfilePage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        number: "",
        image: ""
    });

    // Ambassador state
    const [ambassadorStatus, setAmbassadorStatus] = useState<AmbassadorApplicationStatus>("not_applied");
    const [ambassadorApplication, setAmbassadorApplication] = useState<AmbassadorApplication | null>(null);
    const [showApplicationForm, setShowApplicationForm] = useState(false);
    const [submittingApplication, setSubmittingApplication] = useState(false);
    const [uploadingStudentId, setUploadingStudentId] = useState(false);
    const [ambassadorForm, setAmbassadorForm] = useState({
        fullName: "",
        phone: "",
        collegeName: "",
        degree: "",
        branch: "",
        graduationYear: "",
        studentIdUrl: "",
        socialProfileUrl: "",
        campusInfluence: "",
        preferredPromoCode: "",
    });

    useEffect(() => {
        if (status === "authenticated") {
            fetchProfile();
            fetchAmbassadorStatus();
        } else if (status === "unauthenticated") {
            setLoading(false);
        }
    }, [status]);

    const fetchProfile = async () => {
        try {
            const res = await fetch("/api/user/profile");
            if (res.ok) {
                const data = await res.json();
                setProfile(data);
                setFormData({
                    name: data.name || "",
                    number: data.number || "",
                    image: data.image || ""
                });
                setAmbassadorForm(prev => ({
                    ...prev,
                    fullName: prev.fullName || data.name || "",
                    phone: prev.phone || data.number || "",
                }));
            }
        } catch (error) {
            console.error("Error fetching profile:", error);
            toast({
                title: "Error",
                description: "Failed to load profile data",
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }
    };

    const fetchAmbassadorStatus = async () => {
        try {
            const res = await fetch("/api/user/ambassador-application");
            if (res.ok) {
                const data = await res.json();
                if (data.application) {
                    setAmbassadorStatus(data.application.status);
                    setAmbassadorApplication(data.application);
                } else {
                    setAmbassadorStatus("not_applied");
                }
            }
        } catch (error) {
            console.error("Error fetching ambassador status:", error);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const res = await fetch("/api/user/profile", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                setProfile(prev => prev ? { ...prev, ...formData } : null);
                setIsEditing(false);
                toast({
                    title: "Success",
                    description: "Profile updated successfully"
                });
            } else {
                throw new Error("Failed to update");
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to update profile",
                variant: "destructive"
            });
        } finally {
            setSaving(false);
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploadingImage(true);
        try {
            const result = await uploadImageToImgBB(file);
            setFormData(prev => ({ ...prev, image: result.url }));

            const res = await fetch("/api/user/profile", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ image: result.url })
            });

            if (res.ok) {
                setProfile(prev => prev ? { ...prev, image: result.url } : null);
                toast({
                    title: "Success",
                    description: "Profile picture updated"
                });
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to upload image",
                variant: "destructive"
            });
        } finally {
            setUploadingImage(false);
        }
    };

    const handleStudentIdUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploadingStudentId(true);
        try {
            const result = await uploadImageToImgBB(file);
            setAmbassadorForm(prev => ({ ...prev, studentIdUrl: result.url }));
            toast({ title: "Uploaded", description: "Student ID photo uploaded successfully" });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to upload student ID photo",
                variant: "destructive"
            });
        } finally {
            setUploadingStudentId(false);
        }
    };

    const handleAmbassadorSubmit = async () => {
        const { fullName, phone, collegeName, degree, branch, graduationYear, studentIdUrl, socialProfileUrl, campusInfluence, preferredPromoCode } = ambassadorForm;

        if (!fullName || !phone || !collegeName || !degree || !branch || !graduationYear || !studentIdUrl || !socialProfileUrl || !campusInfluence || !preferredPromoCode) {
            toast({
                title: "Missing Fields",
                description: "Please fill in all required fields",
                variant: "destructive"
            });
            return;
        }

        setSubmittingApplication(true);
        try {
            const res = await fetch("/api/user/ambassador-application", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(ambassadorForm)
            });

            if (res.ok) {
                const data = await res.json();
                setAmbassadorStatus("pending");
                setAmbassadorApplication(data.application);
                setShowApplicationForm(false);
                toast({
                    title: "Application Submitted!",
                    description: "Your Campus Ambassador application has been submitted successfully."
                });
            } else {
                const errorData = await res.json().catch(() => null);
                throw new Error(errorData?.error || "Failed to submit application");
            }
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message || "Failed to submit application",
                variant: "destructive"
            });
        } finally {
            setSubmittingApplication(false);
        }
    };

    const handleLogout = async () => {
        await signOut({ callbackUrl: "/" });
    };

    if (status === "loading" || loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="w-16 h-16 border-4 border-foreground border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (status === "unauthenticated") {
        return <LoginTC />;
    }

    return (
        <div className="min-h-screen bg-background text-foreground pb-20 md:pb-0">
            <Header />

            <div className="container mx-auto px-4 py-8 mt-16 md:mt-20 max-w-2xl">
                <h1 className="text-3xl font-display font-bold text-foreground mb-8">My Profile</h1>

                <Tabs defaultValue="profile" className="w-full">
                    <TabsList className="w-full bg-white/5 border border-white/10 rounded-xl p-1 h-auto">
                        <TabsTrigger
                            value="profile"
                            className="flex-1 text-xs sm:text-sm data-[state=active]:bg-foreground data-[state=active]:text-black rounded-lg py-2.5"
                        >
                            Profile & Info
                        </TabsTrigger>
                        <TabsTrigger
                            value="support"
                            className="flex-1 text-xs sm:text-sm data-[state=active]:bg-foreground data-[state=active]:text-black rounded-lg py-2.5"
                        >
                            About & Support
                        </TabsTrigger>
                        <TabsTrigger
                            value="ambassador"
                            className="flex-1 text-xs sm:text-sm data-[state=active]:bg-foreground data-[state=active]:text-black rounded-lg py-2.5 relative"
                        >
                            Campus IB
                            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-amber-500 rounded-full" />
                        </TabsTrigger>
                    </TabsList>

                    {/* Tab 1: Profile & Info */}
                    <TabsContent value="profile">
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mt-4 relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-gold/20 to-transparent"></div>

                            <div className="relative flex flex-col md:flex-row gap-6 items-start md:items-center">
                                <div className="relative group">
                                    <div className="w-24 h-24 rounded-full border-2 border-foreground overflow-hidden bg-black/50 flex items-center justify-center">
                                        {profile?.image || formData.image ? (
                                            <img
                                                src={formData.image || profile?.image}
                                                alt="Profile"
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <User className="w-10 h-10 text-gray-400" />
                                        )}
                                    </div>
                                    <label className="absolute bottom-0 right-0 p-1.5 bg-foreground rounded-full cursor-pointer hover:bg-yellow-500 transition-colors shadow-lg">
                                        {uploadingImage ? (
                                            <Loader2 className="w-4 h-4 text-black animate-spin" />
                                        ) : (
                                            <Camera className="w-4 h-4 text-black" />
                                        )}
                                        <input
                                            type="file"
                                            className="hidden"
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                            disabled={uploadingImage}
                                        />
                                    </label>
                                </div>

                                <div className="flex-1 w-full">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h2 className="text-2xl font-bold text-white">{profile?.name}</h2>
                                            <p className="text-gray-400">{profile?.email}</p>
                                        </div>
                                        {!isEditing && (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => setIsEditing(true)}
                                                className="text-foreground hover:text-white hover:bg-white/10"
                                            >
                                                <Edit2 className="w-4 h-4 mr-2" />
                                                Edit
                                            </Button>
                                        )}
                                    </div>

                                    {isEditing ? (
                                        <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                                            <div>
                                                <Label htmlFor="name" className="text-gray-300">Full Name</Label>
                                                <Input
                                                    id="name"
                                                    value={formData.name}
                                                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                                    className="bg-black/50 border-white/10 text-white mt-1"
                                                />
                                            </div>
                                            <div>
                                                <Label htmlFor="number" className="text-gray-300">Mobile Number</Label>
                                                <Input
                                                    id="number"
                                                    value={formData.number}
                                                    onChange={(e) => setFormData(prev => ({ ...prev, number: e.target.value }))}
                                                    className="bg-black/50 border-white/10 text-white mt-1"
                                                    placeholder="+91 98765 43210"
                                                />
                                            </div>
                                            <div className="flex gap-2 justify-end mt-4">
                                                <Button
                                                    variant="ghost"
                                                    onClick={() => {
                                                        setIsEditing(false);
                                                        setFormData({
                                                            name: profile?.name || "",
                                                            number: profile?.number || "",
                                                            image: profile?.image || ""
                                                        });
                                                    }}
                                                    className="text-gray-400 hover:text-white"
                                                >
                                                    <X className="w-4 h-4 mr-2" />
                                                    Cancel
                                                </Button>
                                                <Button
                                                    onClick={handleSave}
                                                    disabled={saving}
                                                    className="bg-foreground hover:bg-foreground/80 text-black"
                                                >
                                                    {saving ? (
                                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                    ) : (
                                                        <Save className="w-4 h-4 mr-2" />
                                                    )}
                                                    Save Changes
                                                </Button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-3 text-gray-300">
                                                <Phone className="w-4 h-4 text-foreground" />
                                                <span>{profile?.number || "No number added"}</span>
                                            </div>
                                            <div className="flex items-center gap-3 text-gray-300">
                                                <Mail className="w-4 h-4 text-foreground" />
                                                <span>{profile?.email}</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </TabsContent>

                    {/* Tab 2: About & Support */}
                    <TabsContent value="support">
                        <div className="mt-4 space-y-4">
                            <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
                                <a href="/about" className="flex items-center justify-between p-4 hover:bg-white/5 transition-colors border-b border-white/5">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
                                            <Info className="w-5 h-5" />
                                        </div>
                                        <span className="text-white font-medium">About CONSOUL INDIA</span>
                                    </div>
                                    <ChevronRight className="w-5 h-5 text-gray-500" />
                                </a>

                                <a href="/privacy-policy" className="flex items-center justify-between p-4 hover:bg-white/5 transition-colors border-b border-white/5">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-green-500/10 rounded-lg text-green-400">
                                            <Shield className="w-5 h-5" />
                                        </div>
                                        <span className="text-white font-medium">Privacy Policy</span>
                                    </div>
                                    <ChevronRight className="w-5 h-5 text-gray-500" />
                                </a>

                                <a href="/terms" className="flex items-center justify-between p-4 hover:bg-white/5 transition-colors border-b border-white/5">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400">
                                            <FileText className="w-5 h-5" />
                                        </div>
                                        <span className="text-white font-medium">Terms & Conditions</span>
                                    </div>
                                    <ChevronRight className="w-5 h-5 text-gray-500" />
                                </a>

                                <a href="/refund-policy" className="flex items-center justify-between p-4 hover:bg-white/5 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-amber-500/10 rounded-lg text-amber-400">
                                            <ShieldAlert className="w-5 h-5" />
                                        </div>
                                        <span className="text-white font-medium">Cancellation & Refund Policy</span>
                                    </div>
                                    <ChevronRight className="w-5 h-5 text-gray-500" />
                                </a>
                            </div>
                        </div>
                    </TabsContent>

                    {/* Tab 3: Campus Ambassador (IB) */}
                    <TabsContent value="ambassador">
                        <div className="mt-4">
                            {ambassadorStatus === "not_applied" && !showApplicationForm && (
                                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                                    <div className="relative">
                                        <div className="flex items-center gap-3 mb-3">
                                            <GraduationCap className="w-6 h-6 text-amber-400" />
                                            <h3 className="text-lg font-bold text-white">BECOME A CONSOUL CAMPUS AMBASSADOR (IB)</h3>
                                        </div>
                                        <p className="text-gray-400 mb-5">
                                            Represent your college. Earn ₹500–₹1,000 per booking + Free Trips.
                                        </p>

                                        <div className="space-y-2.5 mb-6">
                                            <p className="text-sm font-semibold text-gray-300">Benefits:</p>
                                            <div className="space-y-2">
                                                {[
                                                    "Earn ₹500–₹1,000 commission per booking",
                                                    "Fill 10 seats and earn a 100% FREE expedition",
                                                    "Get your own promo code (e.g. ARYAN-NITR)",
                                                    "Access exclusive marketing toolkit",
                                                    "Join the Campus Leaderboard",
                                                ].map((benefit) => (
                                                    <div key={benefit} className="flex items-start gap-2">
                                                        <CheckCircle2 className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
                                                        <span className="text-sm text-gray-300">{benefit}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <Button
                                            onClick={() => setShowApplicationForm(true)}
                                            className="bg-foreground hover:bg-foreground/80 text-black font-semibold"
                                        >
                                            Apply Now
                                            <ArrowRight className="w-4 h-4 ml-2" />
                                        </Button>
                                    </div>
                                </div>
                            )}

                            {ambassadorStatus === "not_applied" && showApplicationForm && (
                                <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                                    <div className="flex items-center justify-between mb-6">
                                        <h3 className="text-lg font-bold text-white">Campus Ambassador Application</h3>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => setShowApplicationForm(false)}
                                            className="text-gray-400 hover:text-white"
                                        >
                                            <X className="w-4 h-4" />
                                        </Button>
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <Label htmlFor="amb-name" className="text-gray-300">Full Name</Label>
                                            <Input
                                                id="amb-name"
                                                value={ambassadorForm.fullName}
                                                onChange={(e) => setAmbassadorForm(prev => ({ ...prev, fullName: e.target.value }))}
                                                className="bg-black/50 border-white/10 text-white mt-1"
                                            />
                                        </div>

                                        <div>
                                            <Label htmlFor="amb-phone" className="text-gray-300">Phone Number</Label>
                                            <Input
                                                id="amb-phone"
                                                value={ambassadorForm.phone}
                                                onChange={(e) => setAmbassadorForm(prev => ({ ...prev, phone: e.target.value }))}
                                                className="bg-black/50 border-white/10 text-white mt-1"
                                                placeholder="+91 98765 43210"
                                            />
                                        </div>

                                        <div>
                                            <Label htmlFor="amb-college" className="text-gray-300">College / University Name</Label>
                                            <Input
                                                id="amb-college"
                                                value={ambassadorForm.collegeName}
                                                onChange={(e) => setAmbassadorForm(prev => ({ ...prev, collegeName: e.target.value }))}
                                                className="bg-black/50 border-white/10 text-white mt-1"
                                                placeholder="e.g. NIT Raipur, GGU Bilaspur"
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <Label htmlFor="amb-degree" className="text-gray-300">Degree</Label>
                                                <Input
                                                    id="amb-degree"
                                                    value={ambassadorForm.degree}
                                                    onChange={(e) => setAmbassadorForm(prev => ({ ...prev, degree: e.target.value }))}
                                                    className="bg-black/50 border-white/10 text-white mt-1"
                                                    placeholder="e.g. B.Tech"
                                                />
                                            </div>
                                            <div>
                                                <Label htmlFor="amb-branch" className="text-gray-300">Branch</Label>
                                                <Input
                                                    id="amb-branch"
                                                    value={ambassadorForm.branch}
                                                    onChange={(e) => setAmbassadorForm(prev => ({ ...prev, branch: e.target.value }))}
                                                    className="bg-black/50 border-white/10 text-white mt-1"
                                                    placeholder="e.g. Mechanical Engineering"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <Label htmlFor="amb-year" className="text-gray-300">Year of Graduation</Label>
                                            <Input
                                                id="amb-year"
                                                value={ambassadorForm.graduationYear}
                                                onChange={(e) => setAmbassadorForm(prev => ({ ...prev, graduationYear: e.target.value }))}
                                                className="bg-black/50 border-white/10 text-white mt-1"
                                                placeholder="e.g. 2027"
                                            />
                                        </div>

                                        <div>
                                            <Label className="text-gray-300">Student ID Photo</Label>
                                            <div className="mt-1">
                                                {ambassadorForm.studentIdUrl ? (
                                                    <div className="flex items-center gap-3">
                                                        <img
                                                            src={ambassadorForm.studentIdUrl}
                                                            alt="Student ID"
                                                            className="w-16 h-16 rounded-lg object-cover border border-white/10"
                                                        />
                                                        <label className="cursor-pointer text-sm text-amber-400 hover:text-amber-300 transition-colors">
                                                            Change photo
                                                            <input
                                                                type="file"
                                                                className="hidden"
                                                                accept="image/*"
                                                                onChange={handleStudentIdUpload}
                                                                disabled={uploadingStudentId}
                                                            />
                                                        </label>
                                                    </div>
                                                ) : (
                                                    <label className="flex items-center justify-center gap-2 p-4 border border-dashed border-white/20 rounded-xl cursor-pointer hover:border-white/40 hover:bg-white/5 transition-colors">
                                                        {uploadingStudentId ? (
                                                            <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />
                                                        ) : (
                                                            <Upload className="w-5 h-5 text-gray-400" />
                                                        )}
                                                        <span className="text-sm text-gray-400">
                                                            {uploadingStudentId ? "Uploading..." : "Upload Student ID Photo"}
                                                        </span>
                                                        <input
                                                            type="file"
                                                            className="hidden"
                                                            accept="image/*"
                                                            onChange={handleStudentIdUpload}
                                                            disabled={uploadingStudentId}
                                                        />
                                                    </label>
                                                )}
                                            </div>
                                        </div>

                                        <div>
                                            <Label htmlFor="amb-social" className="text-gray-300">Instagram or LinkedIn Profile URL</Label>
                                            <Input
                                                id="amb-social"
                                                value={ambassadorForm.socialProfileUrl}
                                                onChange={(e) => setAmbassadorForm(prev => ({ ...prev, socialProfileUrl: e.target.value }))}
                                                className="bg-black/50 border-white/10 text-white mt-1"
                                                placeholder="https://instagram.com/yourhandle"
                                            />
                                        </div>

                                        <div>
                                            <Label htmlFor="amb-influence" className="text-gray-300">Campus Influence</Label>
                                            <Textarea
                                                id="amb-influence"
                                                value={ambassadorForm.campusInfluence}
                                                onChange={(e) => setAmbassadorForm(prev => ({ ...prev, campusInfluence: e.target.value }))}
                                                className="bg-black/50 border-white/10 text-white mt-1"
                                                placeholder="Describe your campus networks, clubs, hostel influence..."
                                                rows={3}
                                            />
                                        </div>

                                        <div>
                                            <Label htmlFor="amb-promo" className="text-gray-300">Preferred Promo Code</Label>
                                            <Input
                                                id="amb-promo"
                                                value={ambassadorForm.preferredPromoCode}
                                                onChange={(e) => setAmbassadorForm(prev => ({ ...prev, preferredPromoCode: e.target.value.toUpperCase() }))}
                                                className="bg-black/50 border-white/10 text-white mt-1 uppercase"
                                                placeholder="e.g. ARYAN-NITR"
                                            />
                                            <p className="text-xs text-gray-500 mt-1">Format: FIRSTNAME-COLLEGE_ABBREVIATION</p>
                                        </div>

                                        <Button
                                            onClick={handleAmbassadorSubmit}
                                            disabled={submittingApplication}
                                            className="w-full bg-foreground hover:bg-foreground/80 text-black font-semibold py-5 mt-2"
                                        >
                                            {submittingApplication ? (
                                                <>
                                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                    Submitting...
                                                </>
                                            ) : (
                                                "Submit Application"
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            )}

                            {ambassadorStatus === "pending" && ambassadorApplication && (
                                <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                                    <div className="flex items-center gap-3 mb-3">
                                        <Clock className="w-6 h-6 text-amber-400" />
                                        <h3 className="text-lg font-bold text-white">Application Under Review</h3>
                                    </div>
                                    <p className="text-gray-400 mb-4">
                                        Your Campus Ambassador application was submitted on{" "}
                                        {new Date(ambassadorApplication.appliedAt).toLocaleDateString("en-IN", {
                                            day: "numeric",
                                            month: "long",
                                            year: "numeric",
                                        })}
                                        . Our team is reviewing your details. You&apos;ll be notified once approved.
                                    </p>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex items-center gap-2 text-gray-300">
                                            <span className="text-gray-500">Applied as:</span>
                                            <span>{ambassadorApplication.fullName} from {ambassadorApplication.collegeName}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-gray-300">
                                            <span className="text-gray-500">Preferred Code:</span>
                                            <span className="font-mono text-amber-400">{ambassadorApplication.preferredPromoCode}</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {ambassadorStatus === "approved" && ambassadorApplication && (
                                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                                    <div className="relative">
                                        <div className="flex items-center gap-3 mb-3">
                                            <CheckCircle2 className="w-6 h-6 text-green-400" />
                                            <h3 className="text-lg font-bold text-white">You&apos;re a CONSOUL Campus Ambassador!</h3>
                                        </div>
                                        <p className="text-gray-400 mb-4">
                                            Your promo code:{" "}
                                            <span className="font-mono text-amber-400 font-bold text-lg">
                                                {ambassadorApplication.generatedPromoCode || ambassadorApplication.preferredPromoCode}
                                            </span>
                                        </p>
                                        <Button
                                            onClick={() => router.push("/ambassador/dashboard")}
                                            className="bg-foreground hover:bg-foreground/80 text-black font-semibold"
                                        >
                                            Open Ambassador Dashboard
                                            <ArrowRight className="w-4 h-4 ml-2" />
                                        </Button>
                                    </div>
                                </div>
                            )}

                            {ambassadorStatus === "rejected" && ambassadorApplication && (
                                <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                                    <div className="flex items-center gap-3 mb-3">
                                        <XCircle className="w-6 h-6 text-red-400" />
                                        <h3 className="text-lg font-bold text-white">Application Not Approved</h3>
                                    </div>
                                    <p className="text-gray-400 mb-4">
                                        Unfortunately your application wasn&apos;t approved at this time.
                                    </p>
                                    {ambassadorApplication.adminNotes && (
                                        <div className="bg-black/30 border border-white/5 rounded-xl p-3 mb-4">
                                            <p className="text-xs text-gray-500 mb-1">Feedback:</p>
                                            <p className="text-sm text-gray-300">{ambassadorApplication.adminNotes}</p>
                                        </div>
                                    )}
                                    <p className="text-sm text-gray-500">
                                        You can reapply after improving your campus presence.
                                    </p>
                                </div>
                            )}
                        </div>
                    </TabsContent>
                </Tabs>

                <Button
                    onClick={handleLogout}
                    variant="destructive"
                    className="w-full py-6 mt-8 text-lg font-medium bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20"
                >
                    <LogOut className="w-5 h-5 mr-2" />
                    Log Out
                </Button>

                <p className="text-center text-gray-600 text-sm mt-8">
                    CONSOUL INDIA App v1.0.0
                </p>
            </div>

            <BottomTabBar />
            <Footer />
        </div>
    );
}
