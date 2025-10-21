import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../components/auth/AuthProvider';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { ExternalLink, Youtube, MessageSquare, BookOpen, Users, Calendar, Newspaper } from 'lucide-react';
import { blogLinks } from '../data/blogLinks';

export default function Blog() {
    const { user } = useAuthContext();
    const navigate = useNavigate();

    React.useEffect(() => {
        if (!user) {
            navigate('/login');
        }
    }, [user, navigate]);

    if (!user) {
        return null;
    }

    const getIcon = (type: string) => {
        switch (type) {
            case 'youtube':
                return <Youtube className="w-5 h-5 text-red-500" />;
            case 'reddit':
                return <MessageSquare className="w-5 h-5 text-orange-500" />;
            case 'journal':
                return <BookOpen className="w-5 h-5 text-blue-500" />;
            case 'community':
                return <Users className="w-5 h-5 text-green-500" />;
            case 'event':
                return <Calendar className="w-5 h-5 text-purple-500" />;
            case 'news':
                return <Newspaper className="w-5 h-5 text-gray-500" />;
            default:
                return <ExternalLink className="w-5 h-5 text-speech-green" />;
        }
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'youtube':
                return 'bg-red-50 border-red-200';
            case 'reddit':
                return 'bg-orange-50 border-orange-200';
            case 'journal':
                return 'bg-blue-50 border-blue-200';
            case 'community':
                return 'bg-green-50 border-green-200';
            case 'event':
                return 'bg-purple-50 border-purple-200';
            case 'news':
                return 'bg-gray-50 border-gray-200';
            default:
                return 'bg-speech-bg border-speech-green/20';
        }
    };

    const getTypeLabel = (type: string) => {
        switch (type) {
            case 'youtube':
                return 'YouTube';
            case 'reddit':
                return 'Reddit';
            case 'journal':
                return 'Journal';
            case 'community':
                return 'Community';
            case 'event':
                return 'Event';
            case 'news':
                return 'News';
            default:
                return 'Resource';
        }
    };

    return (
        <div className="min-h-screen bg-speech-bg">
            <Navigation />

            {/* Hero Section */}
            <div className="relative min-h-[40vh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-speech-green/20 to-speech-bg/80"></div>
                <div className="relative z-10 text-center px-4 md:px-6 lg:px-8">
                    <h1 className="font-bricolage text-4xl md:text-5xl lg:text-6xl font-bold text-speech-green mb-4 tracking-wide">
                        Speech Therapy Resources
                    </h1>
                    <p className="font-bricolage text-xl md:text-2xl text-speech-green/80 max-w-3xl mx-auto leading-relaxed tracking-wide">
                        Discover curated resources, communities, and educational content to support your speech therapy journey.
                    </p>
                </div>
            </div>

            {/* Resources Grid */}
            <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {blogLinks.map((link, index) => (
                        <Card key={index} className={`hover:shadow-lg transition-all duration-300 ${getTypeColor(link.type)}`}>
                            <CardHeader className="pb-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        {getIcon(link.type)}
                                        <span className="font-bricolage text-sm font-semibold text-speech-green/70 uppercase tracking-wide">
                                            {getTypeLabel(link.type)}
                                        </span>
                                    </div>
                                    <ExternalLink className="w-4 h-4 text-speech-green/50" />
                                </div>
                                <CardTitle className="font-bricolage text-lg text-speech-green leading-tight">
                                    {link.title}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="font-bricolage text-sm text-speech-green/70 mb-4 leading-relaxed">
                                    {link.description}
                                </p>
                                <div className="flex items-center justify-between">
                                    <span className="font-bricolage text-xs text-speech-green/60">
                                        {link.date}
                                    </span>
                                    <Button
                                        asChild
                                        size="sm"
                                        className="bg-speech-green hover:bg-speech-green/90 text-white font-bricolage"
                                    >
                                        <a
                                            href={link.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-1"
                                        >
                                            Visit
                                            <ExternalLink className="w-3 h-3" />
                                        </a>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {blogLinks.length === 0 && (
                    <div className="text-center py-12">
                        <div className="w-16 h-16 bg-speech-bg rounded-full flex items-center justify-center mx-auto mb-4">
                            <BookOpen className="w-8 h-8 text-speech-green/50" />
                        </div>
                        <h3 className="font-bricolage text-xl font-semibold text-speech-green mb-2">
                            Resources Coming Soon
                        </h3>
                        <p className="font-bricolage text-speech-green/70">
                            We're curating the best speech therapy resources for you. Check back soon!
                        </p>
                    </div>
                )}
            </div>

            <Footer />
        </div>
    );
}
