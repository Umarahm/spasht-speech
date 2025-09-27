export const quotes = [
    {
        text: "The way we speak is deeply personal. It tells others who we are and where we come from.",
        author: "Maya Angelou",
        category: "identity"
    },
    {
        text: "Communication is the solvent of all problems and is the foundation for personal development.",
        author: "Peter Shepherd",
        category: "growth"
    },
    {
        text: "Your voice is your identity. Speak with confidence and the world will listen.",
        author: "Unknown",
        category: "confidence"
    },
    {
        text: "The most important thing in communication is hearing what isn't said.",
        author: "Peter Drucker",
        category: "listening"
    },
    {
        text: "Words are free. It's how you use them that may cost you.",
        author: "KushandWizdom",
        category: "wisdom"
    },
    {
        text: "Speak only if it improves upon the silence.",
        author: "Mahatma Gandhi",
        category: "mindfulness"
    },
    {
        text: "The difference between the right word and the almost right word is the difference between lightning and a lightning bug.",
        author: "Mark Twain",
        category: "precision"
    },
    {
        text: "One of the most sincere forms of respect is actually listening to what another has to say.",
        author: "Bryant H. McGill",
        category: "respect"
    },
    {
        text: "The art of communication is the language of leadership.",
        author: "James Humes",
        category: "leadership"
    },
    {
        text: "Your words become your world.",
        author: "Unknown",
        category: "manifestation"
    }
];

// Function to get a random quote
export const getRandomQuote = () => {
    return quotes[Math.floor(Math.random() * quotes.length)];
};

// Function to get quote by category
export const getQuoteByCategory = (category) => {
    const categoryQuotes = quotes.filter(quote => quote.category === category);
    return categoryQuotes[Math.floor(Math.random() * categoryQuotes.length)];
};
