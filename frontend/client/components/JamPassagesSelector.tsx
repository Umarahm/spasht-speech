import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription } from './ui/drawer';
import { Button } from './ui/button';
import { FileText, Music } from 'lucide-react';

interface JamPassagesSelectorProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function JamPassagesSelector({ open, onOpenChange }: JamPassagesSelectorProps) {
    const navigate = useNavigate();
    const isMobile = window.innerWidth < 768; // md breakpoint

    const handleSelectPassages = () => {
        onOpenChange(false);
        navigate('/passages');
    };

    const handleSelectJams = () => {
        onOpenChange(false);
        navigate('/jams');
    };

    const content = (
        <>
            <div className="text-center mb-6">
                <h3 className="font-bricolage text-2xl font-bold text-speech-green mb-2 tracking-wide">
                    Choose Your Practice Type
                </h3>
                <p className="font-bricolage text-speech-green/70 tracking-wide">
                    Select passages for reading practice or jams for just-a-minute speech therapy
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Passages Option */}
                <button
                    onClick={handleSelectPassages}
                    className="group bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 border border-blue-200 rounded-2xl p-6 transition-all duration-300 hover:shadow-lg hover:scale-105"
                >
                    <div className="flex flex-col items-center text-center">
                        <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                            <FileText className="w-8 h-8 text-white" />
                        </div>
                        <h4 className="font-bricolage font-bold text-lg text-speech-green mb-2 tracking-wide">
                            Passages
                        </h4>
                        {/* <p className="font-bricolage text-sm text-speech-green/70 leading-relaxed tracking-wide">
              Practice reading comprehension and articulation with carefully selected passages
            </p> */}
                    </div>
                </button>

                {/* Jams Option */}
                <button
                    onClick={handleSelectJams}
                    className="group bg-gradient-to-br from-emerald-50 to-emerald-100 hover:from-emerald-100 hover:to-emerald-200 border border-emerald-200 rounded-2xl p-6 transition-all duration-300 hover:shadow-lg hover:scale-105"
                >
                    <div className="flex flex-col items-center text-center">
                        <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                            <Music className="w-8 h-8 text-white" />
                        </div>
                        <h4 className="font-bricolage font-bold text-lg text-speech-green mb-2 tracking-wide">
                            Jams
                        </h4>
                        {/* <p className="font-bricolage text-sm text-speech-green/70 leading-relaxed tracking-wide">
                            Experience musical speech therapy with interactive rhythm and melody exercises
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
                        <DrawerTitle className="sr-only">Select Practice Type</DrawerTitle>
                        <DrawerDescription className="sr-only">Choose between passages or jams</DrawerDescription>
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
                    <DialogTitle className="sr-only">Select Practice Type</DialogTitle>
                    <DialogDescription className="sr-only">Choose between passages or jams</DialogDescription>
                </DialogHeader>
                {content}
            </DialogContent>
        </Dialog>
    );
}




























