export const CONFIG = {
    herName: "Kanyinsola",
    anniversaryDate: "2024-04-20",
    favoriteColor: "Blue",
    footballTeam: "Manchester United",
    oriki: "Ishola",
    validAnswers: {
        firstName: ["oluwakanyinsola", "kanyinsola"],
        middleName: ["prisca"],
        lastName: ["leigh"],
        favoriteColor: ["blue"],
        footballTeam: ["manchester united", "man u", "man utd", "united"],
        manager: ["michael carrick", "carrick", "michael"],
        oriki: ["ishola"],
        sayLove: ["i love you", "i love you too", "i love u", "love you"],
        // loveNote validation is length-based in Auth.tsx
        anniversaryDate: ["2024-04-20"],
        favoriteMusician: ["jon bellion"],
        favoriteFood: ["macaroni"],
        // jciCreed handled separately via CONFIG.creedAnswers
    },
    creedAnswers: [
        "faith", "god",
        "brotherhood", "sovereignty",
        "economic justice", "free enterprise",
        "government", "men",
        "personality",
        "service", "humanity"
    ],
    music: {
        background: "/assets/music/Run_-_Jon_Bellion_KLICKAUD.mp3",
        title: "Run - Jon Bellion"
    },
    messages: {
        intro: ["Hey Beautiful...", "I made something small...", "Because you mean something big to me."],
        wrongAnswer: [
            "Hmm… that doesn't sound like my baby 🤨",
            "Try again sweetheart",
            "Suspicious girlfriend activity detected 🕵️‍♂️",
            "I know you know this one",
            "Are you sure you're the one? 🤔",
            "Don't make me call the police 👮‍♀️",
            "Baby... focus! 😂",
            "Who are you and what have you done with Kanyinsola? 😤",
            "Incorrect! My heart is locked 🔒",
            "Resetting relationship in 3... 2... just kidding 😂"
        ],
        proposal: {
            setup: "So I have one question...",
            question: "Will you be my Valentine?",
            subText: "I mean… I already know your answer.\nBut I added two buttons so you can pretend you had options.",
            dareText: "I quadruple dare you to press No, lol😏. Emi hotcake 🥞😏",
            yes: "Best decision ever. You just made me the happiest person alive.",
            no: "No matter where the button goes, my heart only follows you. Just say YES ❤️",
            successMessage: "My love for you grows stronger with each passing day. I can't wait to create more beautiful memories with you. You are my forever Valentine. ❤️"
        }
    }
}
