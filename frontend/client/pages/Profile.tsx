import { useAuthContext } from "@/components/auth/AuthProvider";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
    User,
    Mail,
    Calendar,
    Key,
    Copy,
    LogOut,
    ArrowLeft,
    Edit,
    Shield
} from "lucide-react";
import { useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const Profile = () => {
    const { user, logout } = useAuthContext();
    const navigate = useNavigate();
    const [copied, setCopied] = useState<boolean>(false);

    const copyToClipboard = () => {
        if (user?.uid) {
            navigator.clipboard.writeText(user.uid);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    const formatDate = (timestamp: any) => {
        if (!timestamp) return 'Not available';
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    if (!user) {
        return null;
    }

    return (
        <div className="min-h-screen bg-speech-bg flex flex-col">
            <Navigation />

            <div className="flex-1 px-4 py-8 md:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="mb-8">
                        <Button
                            variant="ghost"
                            onClick={() => navigate(-1)}
                            className="mb-4 text-speech-green hover:text-speech-green/80 font-bricolage"
                        >
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back
                        </Button>
                        <h1 className="font-bricolage text-4xl md:text-5xl font-bold text-speech-green tracking-wide">
                            Profile
                        </h1>
                        <p className="font-bricolage text-gray-600 mt-2">
                            Manage your account settings and preferences
                        </p>
                    </div>

                    {/* Profile Card */}
                    <Card className="mb-6 border-2 border-speech-green/20 shadow-lg">
                        <CardHeader>
                            <div className="flex items-center space-x-6">
                                <div className="relative">
                                    <img
                                        src={user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || user.email || 'User')}&background=10b981&color=fff&size=128`}
                                        alt="Profile"
                                        className="w-24 h-24 rounded-full border-4 border-speech-green shadow-md object-cover"
                                    />
                                    <Button
                                        size="sm"
                                        className="absolute bottom-0 right-0 rounded-full bg-speech-green hover:bg-speech-green/90"
                                    >
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                </div>
                                <div>
                                    <CardTitle className="font-bricolage text-2xl text-speech-green">
                                        {user.displayName || 'User'}
                                    </CardTitle>
                                    <CardDescription className="font-bricolage text-gray-600 mt-1">
                                        {user.email}
                                    </CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                    </Card>

                    {/* Account Information */}
                    <Card className="mb-6 border-2 border-speech-green/20 shadow-lg">
                        <CardHeader>
                            <CardTitle className="font-bricolage text-xl text-speech-green flex items-center">
                                <User className="mr-2 h-5 w-5" />
                                Account Information
                            </CardTitle>
                            <CardDescription className="font-bricolage">
                                Your personal account details
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between py-3">
                                <div className="flex items-center space-x-3">
                                    <Mail className="h-5 w-5 text-speech-green" />
                                    <div>
                                        <p className="font-bricolage font-semibold text-gray-800">Email</p>
                                        <p className="font-bricolage text-sm text-gray-600">{user.email}</p>
                                    </div>
                                </div>
                            </div>

                            <Separator className="bg-speech-green/20" />

                            <div className="flex items-center justify-between py-3">
                                <div className="flex items-center space-x-3">
                                    <Calendar className="h-5 w-5 text-speech-green" />
                                    <div>
                                        <p className="font-bricolage font-semibold text-gray-800">Member Since</p>
                                        <p className="font-bricolage text-sm text-gray-600">
                                            {formatDate(user.metadata.creationTime)}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <Separator className="bg-speech-green/20" />

                            <div className="flex items-center justify-between py-3">
                                <div className="flex items-center space-x-3">
                                    <Shield className="h-5 w-5 text-speech-green" />
                                    <div>
                                        <p className="font-bricolage font-semibold text-gray-800">Email Verified</p>
                                        <p className="font-bricolage text-sm text-gray-600">
                                            {user.emailVerified ? 'Verified ✓' : 'Not verified'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Security & Access */}
                    <Card className="mb-6 border-2 border-speech-green/20 shadow-lg">
                        <CardHeader>
                            <CardTitle className="font-bricolage text-xl text-speech-green flex items-center">
                                <Key className="mr-2 h-5 w-5" />
                                Security & Access
                            </CardTitle>
                            <CardDescription className="font-bricolage">
                                Manage your account security settings
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between py-3">
                                <div className="flex items-center space-x-3">
                                    <Key className="h-5 w-5 text-speech-green" />
                                    <div>
                                        <p className="font-bricolage font-semibold text-gray-800">User ID</p>
                                        <p className="font-bricolage text-sm text-gray-600">
                                            {user.uid.slice(0, 20)}...
                                        </p>
                                    </div>
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={copyToClipboard}
                                    className="font-bricolage border-speech-green text-speech-green hover:bg-speech-green/10"
                                >
                                    <Copy className="mr-2 h-4 w-4" />
                                    {copied ? 'Copied!' : 'Copy'}
                                </Button>
                            </div>

                            {copied && (
                                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                                    <p className="text-sm text-green-600 font-bricolage">User ID copied to clipboard!</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Actions */}
                    <Card className="border-2 border-red-200 shadow-lg">
                        <CardHeader>
                            <CardTitle className="font-bricolage text-xl text-red-600 flex items-center">
                                <LogOut className="mr-2 h-5 w-5" />
                                Account Actions
                            </CardTitle>
                            <CardDescription className="font-bricolage">
                                Sign out of your account
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button
                                variant="destructive"
                                onClick={handleLogout}
                                className="font-bricolage w-full md:w-auto"
                            >
                                <LogOut className="mr-2 h-4 w-4" />
                                Sign Out
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default Profile;

