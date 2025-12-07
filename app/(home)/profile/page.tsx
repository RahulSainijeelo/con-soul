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
    Loader2
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { uploadImageToImgBB } from "@/lib/imgbb";
import LoginTC from "@/components/auth/LoginTC";

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

    // Form state
    const [formData, setFormData] = useState({
        name: "",
        number: "",
        image: ""
    });

    useEffect(() => {
        if (status === "authenticated") {
            fetchProfile();
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
                // Refresh session to update name in header/tab bar if needed
                // router.refresh(); 
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

            // Auto save image update
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

    const handleLogout = async () => {
        await signOut({ callbackUrl: "/" });
    };

    if (status === "loading" || loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="w-16 h-16 border-4 border-gold border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (status === "unauthenticated") {
        return <LoginTC />;
    }

    return (
        <div className="min-h-screen bg-black pb-20 md:pb-0">
            <Header />

            <div className="container mx-auto px-4 py-8 mt-16 md:mt-20 max-w-2xl">
                <h1 className="text-3xl font-display font-bold text-white mb-8">My Profile</h1>

                {/* Profile Card */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-gold/20 to-transparent"></div>

                    <div className="relative flex flex-col md:flex-row gap-6 items-start md:items-center">
                        {/* Avatar */}
                        <div className="relative group">
                            <div className="w-24 h-24 rounded-full border-2 border-gold overflow-hidden bg-black/50 flex items-center justify-center">
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
                            <label className="absolute bottom-0 right-0 p-1.5 bg-gold rounded-full cursor-pointer hover:bg-yellow-500 transition-colors shadow-lg">
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

                        {/* Info */}
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
                                        className="text-gold hover:text-white hover:bg-white/10"
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
                                            className="bg-gold hover:bg-yellow-600 text-black"
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
                                        <Phone className="w-4 h-4 text-gold" />
                                        <span>{profile?.number || "No number added"}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-gray-300">
                                        <Mail className="w-4 h-4 text-gold" />
                                        <span>{profile?.email}</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Menu Links */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-400 mb-2 px-1">About & Support</h3>

                    <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
                        <a href="/about" className="flex items-center justify-between p-4 hover:bg-white/5 transition-colors border-b border-white/5">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
                                    <Info className="w-5 h-5" />
                                </div>
                                <span className="text-white font-medium">About Con-soul</span>
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
                    </div>

                    <Button
                        onClick={handleLogout}
                        variant="destructive"
                        className="w-full py-6 mt-8 text-lg font-medium bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20"
                    >
                        <LogOut className="w-5 h-5 mr-2" />
                        Log Out
                    </Button>

                    <p className="text-center text-gray-600 text-sm mt-8">
                        Con-Soul App v1.0.0
                    </p>
                </div>
            </div>

            <BottomTabBar />
            <Footer />
        </div>
    );
}
