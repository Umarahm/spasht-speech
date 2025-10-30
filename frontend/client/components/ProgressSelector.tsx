import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription } from './ui/drawer';
import { Button } from './ui/button';
import { BarChart3, Mic, TrendingUp } from 'lucide-react';

interface ProgressSelectorProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function ProgressSelector({ open, onOpenChange }: ProgressSelectorProps) {
    const navigate = useNavigate();
    const isMobile = window.innerWidth < 768; // md breakpoint

    const handleGameAnalytics = () => {
        onOpenChange(false);
        navigate('/progress');
    };

    const handleSpeechAnalysis = () => {
        onOpenChange(false);
        navigate('/speech-analysis');
    };

    const content = (
        <>
            <div className="text-center mb-6">
                <h3 className="font-bricolage text-2xl font-bold text-speech-green mb-2 tracking-wide">
                    Choose Analytics Type
                </h3>
                <p className="font-bricolage text-speech-green/70 tracking-wide">
                    Select the type of progress analytics you'd like to view
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Game Analytics Option */}
                <button
                    onClick={handleGameAnalytics}
                    className="group bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 border border-blue-200 rounded-2xl p-6 transition-all duration-300 hover:shadow-lg hover:scale-105"
                >
                    <div className="flex flex-col items-center text-center">
                        <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                            <BarChart3 className="w-8 h-8 text-white" />
                        </div>
                        <h4 className="font-bricolage font-bold text-lg text-speech-green mb-2 tracking-wide">
                            Game Analytics
                        </h4>
                        {/* <p className="font-bricolage text-sm text-speech-green/70 leading-relaxed tracking-wide">
                            View your gaming progress, scores, streaks, and performance metrics from speech therapy games
                        </p> */}
                    </div>
                </button>

                {/* Speech Analysis Option */}
                <button
                    onClick={handleSpeechAnalysis}
                    className="group bg-gradient-to-br from-emerald-50 to-emerald-100 hover:from-emerald-100 hover:to-emerald-200 border border-emerald-200 rounded-2xl p-6 transition-all duration-300 hover:shadow-lg hover:scale-105"
                >
                    <div className="flex flex-col items-center text-center">
                        <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                            <TrendingUp className="w-8 h-8 text-white" />
                        </div>
                        <h4 className="font-bricolage font-bold text-lg text-speech-green mb-2 tracking-wide">
                            Speech Analysis
                        </h4>
                        {/* <p className="font-bricolage text-sm text-speech-green/70 leading-relaxed tracking-wide">
                            Analyze your speech patterns, articulation improvements, and fluency progress over time
                        </p> */}
                    </div>
                </button>
            </div>

            <div className="mt-6 text-center">
                <Button
                    variant="outline"
                    onClick={() => onOpenChange(false)}
                    className="font-bricolage border-speech-green text-speech-green hover:bg-speech-green hover:text-white transition-all duration-200"
                >
                    Cancel
                </Button>
            </div>
        </>
    );

    if (isMobile) {
        return (
            <Drawer open={open} onOpenChange={onOpenChange}>
                <DrawerContent className="bg-white">
                    <DrawerHeader>
                        <DrawerTitle className="sr-only">Select Analytics Type</DrawerTitle>
                        <DrawerDescription className="sr-only">Choose between game analytics or speech analysis</DrawerDescription>
                    </DrawerHeader>
                    <div className="px-6 pb-6">
                        {content}
                    </div>
                </DrawerContent>
            </Drawer>
        );
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="bg-white border-speech-green/20">
                <DialogHeader>
                    <DialogTitle className="sr-only">Select Analytics Type</DialogTitle>
                    <DialogDescription className="sr-only">Choose between game analytics or speech analysis</DialogDescription>
                </DialogHeader>
                {content}
            </DialogContent>
        </Dialog>
    );
}
















