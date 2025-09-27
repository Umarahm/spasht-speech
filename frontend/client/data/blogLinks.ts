export interface BlogLink {
    title: string;
    description: string;
    url: string;
    type: 'youtube' | 'reddit' | 'journal' | 'community' | 'event' | 'news';
    date: string;
    tags?: string[];
}

export const blogLinks: BlogLink[] = [
    // Add your blog links here
    // Example structure:
    /*
    {
      title: "Speech Therapy Exercises for Stuttering",
      description: "Comprehensive guide to exercises that can help reduce stuttering and improve fluency.",
      url: "https://example.com/speech-therapy-exercises",
      type: "youtube",
      date: "2024-01-15",
      tags: ["stuttering", "exercises", "fluency"]
    },
    */
    {
        title: "What are some things you think people should know about cerebral palsy?",
        description: "Comprehensive guide to what people should know about cerebral palsy.",
        url: "https://www.reddit.com/r/CerebralPalsy/comments/xpxt2k/what_are_some_things_you_think_people_should_know/",
        type: "reddit",
        date: "2023-09-23",
        tags: ["cerebral palsy", "awareness", "education"]
    },
    {
        title: "Advice on improving speech clarity?",
        description: "Comprehensive guide to advice on improving speech clarity.",
        url: "https://www.reddit.com/r/socialskills/comments/1bj6y5/advice_on_improving_speech_clarity/",
        type: "reddit",
        date: "2013-09-23",
        tags: ["speech clarity", "advice", "improvement"]
    },
    {
        title: "5 Secrets to Stop Stuttering & Speak More Clearly!",
        description: "Comprehensive guide to how to improve speech clarity.",
        url: "https://www.youtube.com/watch?v=6lfoYKUoYB0",
        type: "youtube",
        date: "2025-01-16",
        tags: ["speech clarity", "stuttering", "improvement"]
    },
    {
        title: "The BEST Speech Therapy Resources for Kids with Autism",
        description: "Comprehensive guide to the best speech therapy resources for kids with autism.",
        url: "https://www.youtube.com/watch?v=qL6kL_q1Xw0",
        type: "youtube",
        date: "2025-01-16",
        tags: ["speech therapy", "autism", "resources"]
    },
    {
        title: "Stuttering interventions for children, adolescents, and adults: a systematic review as a part of clinical guidelines",
        description: "Comprehensive guide to the best speech therapy resources for kids with autism.",
        url: "https://www.sciencedirect.com/science/article/abs/pii/S0021992422000612",
        type: "journal",
        date: "2022-09-16",
        tags: ["speech therapy", "stuttering", "resources"]
    },
    {
        title: "Stuttering Community Discord",
        description: "A community for stuttering and stuttering therapy.",
        url: "https://discord.com/invite/stutter",
        type: "community",
        date: "2021-09-16",
        tags: ["speech therapy", "stuttering", "community"]
    }
];
