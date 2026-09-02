/* =====================================================
   HOOPTRACK - MULTI PAGE JAVASCRIPT
===================================================== */

if ("serviceWorker" in navigator) {
    window.addEventListener("load", function() {
        navigator.serviceWorker
            .register("./service-worker.js")
            .catch(function(error) {
                console.error("HoopTrack offline support failed:", error);
            });
    });
}

function isValidNonNegativeNumber(value) {
    return Number.isFinite(value) && value >= 0;
}

function escapeHTML(value) {
    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/\"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function clearHoopTrackData() {
    const hoopTrackKeys = [
        "customExercises",
        "hooptrackGames",
        "shootingHistory",
        "points",
        "freeThrowsMade",
        "freeThrowsAttempts",
        "threePointersMade",
        "threePointersAttempts",
        "rebounds",
        "assists",
        "showTrainingTips",
        "confirmDeleteGames"
    ];

    Object.keys(localStorage).forEach(function(key) {
        if (
            hoopTrackKeys.includes(key) ||
            key.startsWith("original-task")
        ) {
            localStorage.removeItem(key);
        }
    });
}


/* =====================================================
   TRAINING
===================================================== */

const trainingInput =
    document.querySelector("#training-input");

const addButton =
    document.querySelector("#add-button");

const customTraining =
    document.querySelector("#custom-training");

const progress =
    document.querySelector("#progress");

const progressBar =
    document.querySelector("#progress-bar");

const trainingTips =
    document.querySelectorAll(
        "#training-tip, #shooting-tip"
    );

trainingTips.forEach(function(tip) {
    tip.hidden =
        localStorage.getItem("showTrainingTips") === "false";
});


/* =========================
   TRAINING PROGRESS
========================= */

function updateProgress() {

    const checkboxes =
        document.querySelectorAll(
            '.training input[type="checkbox"]'
        );

    let completed = 0;


    checkboxes.forEach(function(box) {

        if (box.checked) {
            completed++;
        }

    });


    if (progress) {

        progress.textContent =
            completed +
            " / " +
            checkboxes.length +
            " completed";

    }


    if (progressBar) {

        let percentage = 0;


        if (checkboxes.length > 0) {

            percentage =
                (completed / checkboxes.length) * 100;

        }


        progressBar.style.width =
            percentage + "%";

    }

}


/* =========================
   CUSTOM EXERCISES
========================= */

function getCustomExercises() {

    const saved =
        localStorage.getItem("customExercises");


    if (saved === null) {
        return [];
    }


    try {

        const exercises = JSON.parse(saved);
        return Array.isArray(exercises) ? exercises : [];

    } catch (error) {

        return [];

    }

}


/* =========================
   ORIGINAL EXERCISES
========================= */

function loadOriginalExercises() {

    const originalCheckboxes =
        document.querySelectorAll(
            '.training input[type="checkbox"][id^="task"]'
        );


    originalCheckboxes.forEach(
        function(checkbox) {

            const saved =
                localStorage.getItem(
                    "original-" + checkbox.id
                );


            if (saved === "true") {

                checkbox.checked = true;

            }


            checkbox.addEventListener(
                "change",
                function() {

                    localStorage.setItem(
                        "original-" + checkbox.id,
                        checkbox.checked
                    );


                    updateProgress();

                }
            );

        }
    );

}


/* =========================
   RENDER CUSTOM EXERCISES
========================= */

function renderCustomExercises() {

    if (!customTraining) {
        return;
    }


    customTraining.innerHTML = "";


    const customExercises =
        getCustomExercises();


    customExercises.forEach(
        function(exercise, index) {

            const label =
                document.createElement("label");


            const checkbox =
                document.createElement("input");


            checkbox.type =
                "checkbox";


            checkbox.checked =
                exercise.completed;


            const deleteButton =
                document.createElement("button");


            deleteButton.textContent =
                "Delete";


            deleteButton.type =
                "button";


            label.appendChild(
                checkbox
            );


            label.append(
                " " + exercise.name
            );


            label.appendChild(
                deleteButton
            );


            customTraining.appendChild(
                label
            );


            /* Checkbox */

            checkbox.addEventListener(
                "change",
                function() {

                    customExercises[index].completed =
                        checkbox.checked;


                    localStorage.setItem(
                        "customExercises",
                        JSON.stringify(customExercises)
                    );


                    updateProgress();

                }
            );


            /* Delete */

            deleteButton.addEventListener(
                "click",
                function() {

                    customExercises.splice(
                        index,
                        1
                    );


                    localStorage.setItem(
                        "customExercises",
                        JSON.stringify(customExercises)
                    );


                    renderCustomExercises();

                }
            );

        }
    );


    updateProgress();

}


/* =========================
   ADD EXERCISE
========================= */

if (addButton && trainingInput) {

    addButton.addEventListener(
        "click",
        function() {

            const exercise =
                trainingInput.value.trim();


            if (exercise === "") {
                return;
            }


            const customExercises =
                getCustomExercises();


            customExercises.push({

                name:
                    exercise,

                completed:
                    false

            });


            localStorage.setItem(
                "customExercises",
                JSON.stringify(customExercises)
            );


            trainingInput.value =
                "";


            renderCustomExercises();

        }
    );


    trainingInput.addEventListener(
        "keydown",
        function(event) {

            if (event.key === "Enter") {

                addButton.click();

            }

        }
    );

}


loadOriginalExercises();

renderCustomExercises();


/* =====================================================
   STATS
===================================================== */

function attachEnterKeySubmit(buttonSelector, inputSelectors) {

    const button =
        document.querySelector(buttonSelector);


    if (!button) {
        return;
    }


    inputSelectors.forEach(
        function(selector) {

            const input =
                document.querySelector(selector);


            if (!input) {
                return;
            }


            input.addEventListener(
                "keydown",
                function(event) {

                    if (event.key === "Enter") {

                        event.preventDefault();
                        button.click();

                    }

                }
            );

        }
    );

}


const saveStatsButton =
    document.querySelector("#save-stats-button");


const pointsInput =
    document.querySelector("#points-input");


const freeThrowsMadeInput =
    document.querySelector(
        "#free-throws-made-input"
    );


const freeThrowsAttemptsInput =
    document.querySelector(
        "#free-throws-attempts-input"
    );


const threePointersMadeInput =
    document.querySelector(
        "#three-pointers-made-input"
    );


const threePointersAttemptsInput =
    document.querySelector(
        "#three-pointers-attempts-input"
    );


const reboundsInput =
    document.querySelector("#rebounds-input");


const assistsInput =
    document.querySelector("#assists-input");


/* =========================
   SAVE STATS
========================= */

if (saveStatsButton) {

    attachEnterKeySubmit(
        "#save-stats-button",
        [
            "#points-input",
            "#free-throws-made-input",
            "#free-throws-attempts-input",
            "#three-pointers-made-input",
            "#three-pointers-attempts-input",
            "#rebounds-input",
            "#assists-input"
        ]
    );


    saveStatsButton.addEventListener(
        "click",
        function() {

            const points =
                Number(pointsInput.value) || 0;


            const ftMade =
                Number(
                    freeThrowsMadeInput.value
                ) || 0;


            const ftAttempts =
                Number(
                    freeThrowsAttemptsInput.value
                ) || 0;


            const threeMade =
                Number(
                    threePointersMadeInput.value
                ) || 0;


            const threeAttempts =
                Number(
                    threePointersAttemptsInput.value
                ) || 0;


            const rebounds =
                Number(
                    reboundsInput.value
                ) || 0;


            const assists =
                Number(
                    assistsInput.value
                ) || 0;

            if (
                ![
                    points,
                    ftMade,
                    ftAttempts,
                    threeMade,
                    threeAttempts,
                    rebounds,
                    assists
                ].every(isValidNonNegativeNumber)
            ) {
                alert("Stats must be non-negative numbers.");
                return;
            }


            if (ftMade > ftAttempts) {

                alert(
                    "Free throws made cannot be greater than attempts."
                );

                return;

            }


            if (threeMade > threeAttempts) {

                alert(
                    "Three pointers made cannot be greater than attempts."
                );

                return;

            }


            document.querySelector(
                "#points-stat"
            ).textContent =
                points;


            document.querySelector(
                "#free-throws-stat"
            ).textContent =
                ftMade +
                " / " +
                ftAttempts;


            document.querySelector(
                "#three-pointers-stat"
            ).textContent =
                threeMade +
                " / " +
                threeAttempts;


            document.querySelector(
                "#rebounds-stat"
            ).textContent =
                rebounds;


            document.querySelector(
                "#assists-stat"
            ).textContent =
                assists;


            const ftPercentage =
                ftAttempts > 0
                    ? (ftMade / ftAttempts) * 100
                    : 0;


            const threePercentage =
                threeAttempts > 0
                    ? (threeMade / threeAttempts) * 100
                    : 0;


            document.querySelector(
                "#free-throws-percentage"
            ).textContent =
                ftPercentage.toFixed(1) +
                "%";


            document.querySelector(
                "#three-pointers-percentage"
            ).textContent =
                threePercentage.toFixed(1) +
                "%";


            localStorage.setItem(
                "points",
                points
            );


            localStorage.setItem(
                "freeThrowsMade",
                ftMade
            );


            localStorage.setItem(
                "freeThrowsAttempts",
                ftAttempts
            );


            localStorage.setItem(
                "threePointersMade",
                threeMade
            );


            localStorage.setItem(
                "threePointersAttempts",
                threeAttempts
            );


            localStorage.setItem(
                "rebounds",
                rebounds
            );


            localStorage.setItem(
                "assists",
                assists
            );

        }
    );

}


/* =========================
   LOAD STATS
========================= */

function loadStats() {

    if (!pointsInput) {
        return;
    }


    const points =
        localStorage.getItem("points");


    const ftMade =
        localStorage.getItem("freeThrowsMade");


    const ftAttempts =
        localStorage.getItem("freeThrowsAttempts");


    const threeMade =
        localStorage.getItem(
            "threePointersMade"
        );


    const threeAttempts =
        localStorage.getItem(
            "threePointersAttempts"
        );


    const rebounds =
        localStorage.getItem("rebounds");


    const assists =
        localStorage.getItem("assists");


    if (points !== null) {

        pointsInput.value =
            points;


        document.querySelector(
            "#points-stat"
        ).textContent =
            points;

    }


    if (
        ftMade !== null &&
        ftAttempts !== null
    ) {

        freeThrowsMadeInput.value =
            ftMade;


        freeThrowsAttemptsInput.value =
            ftAttempts;


        document.querySelector(
            "#free-throws-stat"
        ).textContent =
            ftMade +
            " / " +
            ftAttempts;


        const percentage =
            Number(ftAttempts) > 0
                ? (Number(ftMade) / Number(ftAttempts)) * 100
                : 0;


        document.querySelector(
            "#free-throws-percentage"
        ).textContent =
            percentage.toFixed(1) +
            "%";

    }


    if (
        threeMade !== null &&
        threeAttempts !== null
    ) {

        threePointersMadeInput.value =
            threeMade;


        threePointersAttemptsInput.value =
            threeAttempts;


        document.querySelector(
            "#three-pointers-stat"
        ).textContent =
            threeMade +
            " / " +
            threeAttempts;


        const percentage =
            Number(threeAttempts) > 0
                ? (Number(threeMade) / Number(threeAttempts)) * 100
                : 0;


        document.querySelector(
            "#three-pointers-percentage"
        ).textContent =
            percentage.toFixed(1) +
            "%";

    }


    if (rebounds !== null) {

        reboundsInput.value =
            rebounds;


        document.querySelector(
            "#rebounds-stat"
        ).textContent =
            rebounds;

    }


    if (assists !== null) {

        assistsInput.value =
            assists;


        document.querySelector(
            "#assists-stat"
        ).textContent =
            assists;

    }

}


loadStats();


/* =====================================================
   DASHBOARD
===================================================== */

function loadDashboard() {

    const dashboardGames =
        document.querySelector(
            "#dashboard-games"
        );


    if (!dashboardGames) {
        return;
    }


    /* =========================
       LOAD GAMES
    ========================== */

    let games = [];


    const savedGames =
        localStorage.getItem(
            "hooptrackGames"
        );


    if (savedGames) {

        try {

            const parsedGames =
                JSON.parse(savedGames);

            games =
                Array.isArray(parsedGames)
                    ? parsedGames.filter(function(game) {
                        return game && typeof game === "object";
                    })
                    : [];

        } catch (error) {

            games = [];

        }

    }


    /* =========================
       GAME COUNT
    ========================== */

    dashboardGames.textContent =
        games.length;


    /* =========================
       TOTALS
    ========================== */

    let totalPoints = 0;

    let totalRebounds = 0;

    let totalAssists = 0;

    let totalFTMade = 0;

    let totalFTAttempts = 0;

    let totalTwoMade = 0;

    let totalTwoAttempts = 0;

    let totalThreeMade = 0;

    let totalThreeAttempts = 0;


    games.forEach(function(game) {

        totalPoints +=
            Number(game.points) || 0;


        totalRebounds +=
            Number(game.rebounds) || 0;


        totalAssists +=
            Number(game.assists) || 0;


        totalFTMade +=
            Number(game.freeThrowsMade) || 0;


        totalFTAttempts +=
            Number(game.freeThrowsAttempts) || 0;


        totalTwoMade +=
            Number(game.twoPointersMade) || 0;


        totalTwoAttempts +=
            Number(game.twoPointersAttempts) || 0;


        totalThreeMade +=
            Number(game.threePointersMade) || 0;


        totalThreeAttempts +=
            Number(game.threePointersAttempts) || 0;

    });


    /* =========================
       AVERAGES
    ========================== */

    let ppg = 0;

    let rpg = 0;

    let apg = 0;


    if (games.length > 0) {

        ppg =
            totalPoints /
            games.length;


        rpg =
            totalRebounds /
            games.length;


        apg =
            totalAssists /
            games.length;

    }


    /* =========================
       PERCENTAGES
    ========================== */

    const ftPercentage =
        totalFTAttempts > 0
            ? (totalFTMade / totalFTAttempts) * 100
            : 0;


    const threePercentage =
        totalThreeAttempts > 0
            ? (totalThreeMade / totalThreeAttempts) * 100
            : 0;


    const twoPercentage =
        totalTwoAttempts > 0
            ? (totalTwoMade / totalTwoAttempts) * 100
            : 0;


    /* =========================
       DISPLAY
    ========================== */

    const ppgElement =
        document.querySelector(
            "#dashboard-ppg"
        );


    const rpgElement =
        document.querySelector(
            "#dashboard-rpg"
        );


    const apgElement =
        document.querySelector(
            "#dashboard-apg"
        );


    const ftElement =
        document.querySelector(
            "#dashboard-ft"
        );


    const threeElement =
        document.querySelector(
            "#dashboard-3pt"
        );


    if (ppgElement) {

        ppgElement.textContent =
            ppg.toFixed(1);

    }


    if (rpgElement) {

        rpgElement.textContent =
            rpg.toFixed(1);

    }


    if (apgElement) {

        apgElement.textContent =
            apg.toFixed(1);

    }


    if (ftElement) {

        ftElement.textContent =
            ftPercentage.toFixed(1) +
            "%";

    }


    if (threeElement) {

        threeElement.textContent =
            threePercentage.toFixed(1) +
            "%";

    }


    /* =========================
       RECENT GAMES
    ========================== */

    const recentGamesElement =
        document.querySelector(
            "#dashboard-recent-games"
        );


    if (recentGamesElement) {

        recentGamesElement.innerHTML =
            "";


        if (games.length === 0) {

            recentGamesElement.innerHTML = `
                <p>
                    No games recorded yet.
                </p>
            `;

        } else {

            const recentGames =
                games.slice(0, 3);


            recentGames.forEach(
                function(game) {

                    const card =
                        document.createElement(
                            "div"
                        );


                    card.className =
                        "dashboard-game-card";


                    const ftMade =
                        Number(
                            game.freeThrowsMade
                        ) || 0;


                    const ftAttempts =
                        Number(
                            game.freeThrowsAttempts
                        ) || 0;


                    const twoMade =
                        Number(
                            game.twoPointersMade
                        ) || 0;


                    const twoAttempts =
                        Number(
                            game.twoPointersAttempts
                        ) || 0;


                    const threeMade =
                        Number(
                            game.threePointersMade
                        ) || 0;


                    const threeAttempts =
                        Number(
                            game.threePointersAttempts
                        ) || 0;


                    const ftPercentage =
                        ftAttempts > 0
                            ? (
                                ftMade /
                                ftAttempts
                            ) * 100
                            : 0;


                    const twoPercentage =
                        twoAttempts > 0
                            ? (
                                twoMade /
                                twoAttempts
                            ) * 100
                            : 0;


                    const threePercentage =
                        threeAttempts > 0
                            ? (
                                threeMade /
                                threeAttempts
                            ) * 100
                            : 0;


                    card.innerHTML = `

                        <h3>
                            🏀 vs
                            ${escapeHTML(game.opponent || "Unknown")}
                        </h3>

                        <p>
                            📅
                            ${escapeHTML(game.date || "")}
                            ${
                                game.format
                                    ? " • " + escapeHTML(game.format)
                                    : ""
                            }
                        </p>

                        <p>

                            <strong>
                                ${Number(game.points) || 0}
                                PTS
                            </strong>

                            &nbsp;

                            ${Number(game.rebounds) || 0}
                            REB

                            &nbsp;

                            ${Number(game.assists) || 0}
                            AST

                        </p>

                        <p>

                            FT:
                            ${ftMade}/${ftAttempts}
                            ${
                                ftAttempts > 0
                                    ? " (" +
                                      ftPercentage.toFixed(1) +
                                      "%)"
                                    : ""
                            }

                            &nbsp; • &nbsp;

                            2PT:
                            ${twoMade}/${twoAttempts}
                            ${
                                twoAttempts > 0
                                    ? " (" +
                                      twoPercentage.toFixed(1) +
                                      "%)"
                                    : ""
                            }

                            &nbsp; • &nbsp;

                            3PT:
                            ${threeMade}/${threeAttempts}
                            ${
                                threeAttempts > 0
                                    ? " (" +
                                      threePercentage.toFixed(1) +
                                      "%)"
                                    : ""
                            }

                        </p>

                    `;


                    recentGamesElement.appendChild(
                        card
                    );

                }
            );

        }

    }


    /* =========================
       TRAINING PROGRESS
    ========================== */

    const trainingProgress =
        document.querySelector(
            "#dashboard-training-progress"
        );


    const dashboardProgressBar =
        document.querySelector(
            "#dashboard-progress-bar"
        );


    let totalExercises =
        0;


    let completedExercises =
        0;


    Object.keys(localStorage).forEach(
        function(key) {

            if (
                key.startsWith(
                    "original-task"
                )
            ) {

                totalExercises++;


                if (
                    localStorage.getItem(key)
                    === "true"
                ) {

                    completedExercises++;

                }

            }

        }
    );


    const savedCustom =
        localStorage.getItem(
            "customExercises"
        );


    if (savedCustom) {

        try {

            const parsedExercises =
                JSON.parse(savedCustom);

            const customExercises =
                Array.isArray(parsedExercises)
                    ? parsedExercises.filter(function(exercise) {
                        return exercise && typeof exercise === "object";
                    })
                    : [];


            customExercises.forEach(
                function(exercise) {

                    totalExercises++;


                    if (
                        exercise.completed
                    ) {

                        completedExercises++;

                    }

                }
            );

        } catch (error) {

            console.log(
                "Could not load custom exercises."
            );

        }

    }


    if (
        trainingProgress &&
        dashboardProgressBar
    ) {

        trainingProgress.textContent =
            completedExercises +
            " / " +
            totalExercises +
            " completed";


        let percentage = 0;


        if (totalExercises > 0) {

            percentage =
                (
                    completedExercises /
                    totalExercises
                ) * 100;

        }


        dashboardProgressBar.style.width =
            percentage + "%";

    }

}


loadDashboard();

/* =====================================================
   PERFORMANCE ANALYTICS
===================================================== */

function loadPerformanceAnalytics() {

    const scoringTrend =
        document.querySelector("#scoring-trend");

    const bestScoringGame =
        document.querySelector("#best-scoring-game");

    const bestThreeGame =
        document.querySelector("#best-three-game");

    const bestTwoGame =
        document.querySelector("#best-two-game");

    const bestFTGame =
        document.querySelector("#best-ft-game");

    const bestReboundGame =
        document.querySelector("#best-rebound-game");

    const bestAssistGame =
        document.querySelector("#best-assist-game");


    /*
       If we're not on the Dashboard,
       do nothing.
    */

    if (
        !scoringTrend &&
        !bestScoringGame &&
        !bestThreeGame &&
        !bestTwoGame &&
        !bestFTGame &&
        !bestReboundGame &&
        !bestAssistGame
    ) {
        return;
    }

       const MIN_THREE_ATTEMPTS = 5;
       const MIN_FT_ATTEMPTS = 5;


    /* =========================
       GET GAMES
    ========================== */

    const savedGames =
        localStorage.getItem("hooptrackGames");

    let games = [];


    if (savedGames) {

        try {

            const parsedGames =
                JSON.parse(savedGames);

            games =
                Array.isArray(parsedGames)
                    ? parsedGames.filter(function(game) {
                        return game && typeof game === "object";
                    })
                    : [];

        } catch (error) {

            games = [];

        }

    }


    /* =========================
       NO GAMES
    ========================== */

    if (games.length === 0) {

        if (scoringTrend) {

            scoringTrend.innerHTML =
                "<p>No game data yet.</p>";

        }


        if (bestScoringGame) {

            bestScoringGame.innerHTML =
                "<p>No game data yet.</p>";

        }


        if (bestThreeGame) {

            bestThreeGame.innerHTML =
                "<p>No shooting data yet.</p>";

        }

        [bestTwoGame, bestFTGame, bestReboundGame, bestAssistGame]
            .forEach(function(container) {
                if (container) {
                    container.innerHTML = "<p>No game data yet.</p>";
                }
            });


        return;

    }


    /* =========================
       SCORING TREND
    ========================== */

    if (scoringTrend) {

        scoringTrend.innerHTML = "";

        /*
           Show the 5 most recent games.
        */

        const recentGames =
            games.slice(0, 5).reverse();

        recentGames.forEach(
            function(game, index) {

                const card =
                    document.createElement("div");

                card.className =
                    "scoring-trend-card";

                const points =
                    Number(game.points) || 0;

                card.innerHTML = `

                    <strong>
                        ${points}
                    </strong>

                    <span>
                        Game ${index + 1}
                    </span>

                `;

                scoringTrend.appendChild(card);

            }
        );

    }


    /* =========================
       BEST SCORING GAME
    ========================== */

    if (bestScoringGame) {

        let bestGame =
            games[0];


        games.forEach(
            function(game) {

                const currentPoints =
                    Number(game.points) || 0;

                const bestPoints =
                    Number(bestGame.points) || 0;


                if (currentPoints > bestPoints) {

                    bestGame =
                        game;

                }

            }
        );


        const points =
            Number(bestGame.points) || 0;


        bestScoringGame.innerHTML = `

            <div class="analytics-value">
                ${points} PTS
            </div>

            <p class="analytics-subtext">
                vs ${escapeHTML(bestGame.opponent || "Unknown Opponent")}
            </p>

            <p class="analytics-subtext">
                ${escapeHTML(bestGame.date || "No date")}
            </p>

        `;

    }


    /* =========================
       BEST 3PT GAME
    ========================== */

    if (bestThreeGame) {

        let bestGame = null;

        let bestPercentage = -1;


        games.forEach(
            function(game) {

                const made =
                    Number(
                        game.threePointersMade
                    ) || 0;


                const attempts =
                    Number(
                        game.threePointersAttempts
                    ) || 0;


                /*
                   Ignore games where no
                   3PT attempts were recorded.
                */

                if (attempts < MIN_THREE_ATTEMPTS) {

                    return;

                }


                const percentage =
                    (made / attempts) * 100;


                if (
                    percentage >
                    bestPercentage
                ) {

                    bestPercentage =
                        percentage;

                    bestGame =
                        game;

                }

            }
        );


        if (!bestGame) {

            bestThreeGame.innerHTML = `

                <p>
                    No 3PT shooting data yet.
                </p>

            `;

        } else {

            const made =
                Number(
                    bestGame.threePointersMade
                ) || 0;


            const attempts =
                Number(
                    bestGame.threePointersAttempts
                ) || 0;


            bestThreeGame.innerHTML = `

                <div class="analytics-value">
                    ${made}/${attempts}
                </div>

                <p class="analytics-subtext">
                    ${bestPercentage.toFixed(1)}%
                </p>

                <p class="analytics-subtext">
                    vs ${escapeHTML(bestGame.opponent || "Unknown Opponent")}
                </p>

            `;

        }

    }


    function renderBestGame(container, gamesList, getValue, label, formatValue) {

        if (!container) {
            return;
        }

        const bestGame = gamesList.reduce(function(currentBest, game) {
            return getValue(game) > getValue(currentBest) ? game : currentBest;
        }, gamesList[0]);

        const value = getValue(bestGame);

        container.innerHTML = `
            <div class="analytics-value">
                ${formatValue ? formatValue(bestGame, value) : value} ${label}
            </div>
            <p class="analytics-subtext">
                vs ${escapeHTML(bestGame.opponent || "Unknown Opponent")}
            </p>
            <p class="analytics-subtext">
                ${escapeHTML(bestGame.date || "No date")}
            </p>
        `;
    }


    renderBestGame(
        bestTwoGame,
        games,
        function(game) { return Number(game.twoPointersMade) || 0; },
        "2PT"
    );

    renderBestGame(
        bestReboundGame,
        games,
        function(game) { return Number(game.rebounds) || 0; },
        "REB"
    );

    renderBestGame(
        bestAssistGame,
        games,
        function(game) { return Number(game.assists) || 0; },
        "AST"
    );


    function renderBestPercentageGame(container, fieldPrefix, label, emptyMessage) {

        if (!container) {
            return;
        }

        let bestGame = null;
        let bestPercentage = -1;

        games.forEach(function(game) {
            const made = Number(game[fieldPrefix + "Made"]) || 0;
            const attempts = Number(game[fieldPrefix + "Attempts"]) || 0;

            const minimumAttempts =
                fieldPrefix === "freeThrows"
                    ? MIN_FT_ATTEMPTS
                    : MIN_THREE_ATTEMPTS;

            if (
                attempts >= minimumAttempts &&
                made / attempts > bestPercentage
            ) {
                bestGame = game;
                bestPercentage = made / attempts;
            }
        });

        if (!bestGame) {
            container.innerHTML = `<p>${emptyMessage}</p>`;
            return;
        }

        const made = Number(bestGame[fieldPrefix + "Made"]) || 0;
        const attempts = Number(bestGame[fieldPrefix + "Attempts"]) || 0;

        container.innerHTML = `
            <div class="analytics-value">
                ${made}/${attempts}
            </div>
            <p class="analytics-subtext">
                ${(bestPercentage * 100).toFixed(1)}% ${label}
            </p>
            <p class="analytics-subtext">
                vs ${escapeHTML(bestGame.opponent || "Unknown Opponent")}
            </p>
            <p class="analytics-subtext">
                ${escapeHTML(bestGame.date || "No date")}
            </p>
        `;
    }


    renderBestPercentageGame(
        bestFTGame,
        "freeThrows",
        "FT",
        "No FT shooting data yet."
    );


    renderBestPercentageGame(
        bestThreeGame,
        "threePointers",
        "3PT",
        "No 3PT shooting data yet."
    );

}


loadPerformanceAnalytics();


/* =====================================================
   SHOOTING CALCULATOR
===================================================== */

const makesInput =
    document.querySelector("#makes");


const attemptsInput =
    document.querySelector("#attempts");


const calculateButton =
    document.querySelector("#calculate-button");


const shootingResult =
    document.querySelector("#shooting-result");


if (
    makesInput &&
    attemptsInput &&
    calculateButton &&
    shootingResult
) {

    calculateButton.addEventListener(
        "click",
        function() {

            const makes =
                Number(
                    makesInput.value
                );


            const attempts =
                Number(
                    attemptsInput.value
                );


            if (attempts <= 0) {

                shootingResult.textContent =
                    "Please enter a valid number of attempts.";

                return;

            }


            if (makes < 0) {

                shootingResult.textContent =
                    "Makes cannot be negative.";

                return;

            }


            if (makes > attempts) {

                shootingResult.textContent =
                    "Shots made cannot be greater than shots attempted.";

                return;

            }


            const percentage =
                (makes / attempts) * 100;


            shootingResult.textContent =
                "Shooting percentage: " +
                percentage.toFixed(1) +
                "%";

        }
    );

}


/* =====================================================
   SHOOTING SESSION TRACKER
===================================================== */

const saveShootingButton =
    document.querySelector(
        "#save-shooting-button"
    );


const shootingHistory =
    document.querySelector(
        "#shooting-history"
    );


const shootingSaveMessage =
    document.querySelector(
        "#shooting-save-message"
    );


/* =========================
   LOAD HISTORY
========================= */

function getShootingHistory() {

    const saved =
        localStorage.getItem(
            "shootingHistory"
        );


    if (saved === null) {
        return [];
    }


    try {

        const parsedHistory =
            JSON.parse(saved);

        return Array.isArray(parsedHistory)
            ? parsedHistory.filter(function(session) {
                return session && typeof session === "object";
            })
            : [];

    } catch (error) {

        return [];

    }

}


/* =========================
   CALCULATE PERCENTAGE
========================= */

function calculateShootingPercentage(
    made,
    attempts
) {

    if (attempts === 0) {
        return 0;
    }


    return (
        made /
        attempts
    ) * 100;

}


/* =========================
   RENDER HISTORY
========================= */

function renderShootingHistory() {

    if (!shootingHistory) {
        return;
    }


    const history =
        getShootingHistory();


    shootingHistory.innerHTML =
        "";


    if (history.length === 0) {

        shootingHistory.innerHTML =
            "<p>No shooting sessions recorded yet.</p>";

        return;

    }


    history
        .slice()
        .reverse()
        .forEach(
            function(session) {

                const card =
                    document.createElement(
                        "div"
                    );


                card.className =
                    "shooting-history-card";


                const originalIndex =
                    history.indexOf(
                        session
                    );


                card.innerHTML = `

                    <h3>
                        🎯 ${escapeHTML(session.date)}
                    </h3>

                    <p>
                        <strong>
                            Free Throws:
                        </strong>
                        <br>

                        ${session.ftMade}/${session.ftAttempts}

                        —
                        ${(Number(session.ftPercentage) || 0).toFixed(1)}%
                    </p>

                    <p>
                        <strong>
                            Mid-Range:
                        </strong>
                        <br>

                        ${session.midMade}/${session.midAttempts}

                        —
                        ${(Number(session.midPercentage) || 0).toFixed(1)}%
                    </p>

                    <p>
                        <strong>
                            Three Pointers:
                        </strong>
                        <br>

                        ${session.threeMade}/${session.threeAttempts}

                        —
                        ${(Number(session.threePercentage) || 0).toFixed(1)}%
                    </p>

                    <button
                        class="delete-shooting-button"
                        data-index="${originalIndex}"
                    >
                        Delete
                    </button>

                `;


                const deleteButton =
                    card.querySelector(
                        ".delete-shooting-button"
                    );


                deleteButton.addEventListener(
                    "click",
                    function() {

                        const sessionIndex =
                            Number(
                                deleteButton.dataset.index
                            );


                        const currentHistory =
                            getShootingHistory();


                        currentHistory.splice(
                            sessionIndex,
                            1
                        );


                        localStorage.setItem(
                            "shootingHistory",
                            JSON.stringify(
                                currentHistory
                            )
                        );


                        renderShootingHistory();

                    }
                );


                shootingHistory.appendChild(
                    card
                );

            }
        );

}


/* =========================
   SAVE SESSION
========================= */

if (saveShootingButton) {

    saveShootingButton.addEventListener(
        "click",
        function() {

            const ftMade =
                Number(
                    document.querySelector(
                        "#ft-shooting-made"
                    ).value
                ) || 0;


            const ftAttempts =
                Number(
                    document.querySelector(
                        "#ft-shooting-attempts"
                    ).value
                ) || 0;


            const midMade =
                Number(
                    document.querySelector(
                        "#mid-shooting-made"
                    ).value
                ) || 0;


            const midAttempts =
                Number(
                    document.querySelector(
                        "#mid-shooting-attempts"
                    ).value
                ) || 0;


            const threeMade =
                Number(
                    document.querySelector(
                        "#three-shooting-made"
                    ).value
                ) || 0;


            const threeAttempts =
                Number(
                    document.querySelector(
                        "#three-shooting-attempts"
                    ).value
                ) || 0;


            if (ftMade > ftAttempts) {

                alert(
                    "Free throws made cannot be greater than attempts."
                );

                return;

            }


            if (midMade > midAttempts) {

                alert(
                    "Mid-range makes cannot be greater than attempts."
                );

                return;

            }


            if (threeMade > threeAttempts) {

                alert(
                    "Three pointer makes cannot be greater than attempts."
                );

                return;

            }


            if (
                ftAttempts === 0 &&
                midAttempts === 0 &&
                threeAttempts === 0
            ) {

                alert(
                    "Please enter at least one shooting attempt."
                );

                return;

            }


            const session = {

                date:
                    new Date().toLocaleDateString(),

                ftMade:
                    ftMade,

                ftAttempts:
                    ftAttempts,

                ftPercentage:
                    calculateShootingPercentage(
                        ftMade,
                        ftAttempts
                    ),

                midMade:
                    midMade,

                midAttempts:
                    midAttempts,

                midPercentage:
                    calculateShootingPercentage(
                        midMade,
                        midAttempts
                    ),

                threeMade:
                    threeMade,

                threeAttempts:
                    threeAttempts,

                threePercentage:
                    calculateShootingPercentage(
                        threeMade,
                        threeAttempts
                    )

            };


            const history =
                getShootingHistory();


            history.push(
                session
            );


            localStorage.setItem(
                "shootingHistory",
                JSON.stringify(history)
            );


            document.querySelector(
                "#ft-shooting-made"
            ).value = "";


            document.querySelector(
                "#ft-shooting-attempts"
            ).value = "";


            document.querySelector(
                "#mid-shooting-made"
            ).value = "";


            document.querySelector(
                "#mid-shooting-attempts"
            ).value = "";


            document.querySelector(
                "#three-shooting-made"
            ).value = "";


            document.querySelector(
                "#three-shooting-attempts"
            ).value = "";


            if (shootingSaveMessage) {

                shootingSaveMessage.textContent =
                    "Shooting session saved!";

            }


            renderShootingHistory();

        }
    );

}


renderShootingHistory();


/* =====================================================
   GAME TRACKER
===================================================== */

const saveGameButton =
    document.getElementById(
        "save-game-button"
    );


if (saveGameButton) {

    const gameOpponent =
        document.getElementById(
            "game-opponent"
        );


    const gameFormat =
        document.getElementById(
            "game-format"
        );


    const gameDate =
        document.getElementById(
            "game-date"
        );


    const gamePoints =
        document.getElementById(
            "game-points"
        );


    const gameRebounds =
        document.getElementById(
            "game-rebounds"
        );


    const gameAssists =
        document.getElementById(
            "game-assists"
        );


    const gameFTMade =
        document.getElementById(
            "game-ft-made"
        );


    const gameFTAttempts =
        document.getElementById(
            "game-ft-attempts"
        );


    const gameTwoMade =
        document.getElementById(
            "game-two-made"
        );


    const gameTwoAttempts =
        document.getElementById(
            "game-two-attempts"
        );


    const gameThreeMade =
        document.getElementById(
            "game-three-made"
        );


    const gameThreeAttempts =
        document.getElementById(
            "game-three-attempts"
        );


    const gameHistory =
        document.getElementById(
            "game-history"
        );


    attachEnterKeySubmit(
        "#save-game-button",
        [
            "#game-opponent",
            "#game-format",
            "#game-date",
            "#game-points",
            "#game-rebounds",
            "#game-assists",
            "#game-ft-made",
            "#game-ft-attempts",
            "#game-two-made",
            "#game-two-attempts",
            "#game-three-made",
            "#game-three-attempts"
        ]
    );


    const gameSaveMessage =
        document.getElementById(
            "game-save-message"
        );


    /* =========================
       GET GAMES
    ========================== */

    function getGames() {

        const saved =
            localStorage.getItem(
                "hooptrackGames"
            );


        if (!saved) {
            return [];
        }


        try {

            const parsedGames =
                JSON.parse(saved);

            return Array.isArray(parsedGames)
                ? parsedGames.filter(function(game) {
                    return game && typeof game === "object";
                })
                : [];

        } catch (error) {

            return [];

        }

    }


    /* =========================
       PERCENTAGE
    ========================== */

    function getPercentage(
        made,
        attempts
    ) {

        if (attempts <= 0) {
            return 0;
        }


        return (
            made /
            attempts
        ) * 100;

    }


    /* =========================
       LOAD GAMES
    ========================== */

    function loadGames() {

        const games =
            getGames();


        gameHistory.innerHTML =
            "";


        if (games.length === 0) {

            gameHistory.innerHTML = `
                <p id="no-games-message">
                    No games recorded yet.
                </p>
            `;

            return;

        }


        games.forEach(
            function(game, index) {

                const card =
                    document.createElement(
                        "div"
                    );


                card.className =
                    "game-history-card";


                /* =========================
                   NEW DATA
                ========================== */

                const ftMade =
                    Number(
                        game.freeThrowsMade
                    ) || 0;


                const ftAttempts =
                    Number(
                        game.freeThrowsAttempts
                    ) || 0;


                const twoMade =
                    Number(
                        game.twoPointersMade
                    ) || 0;


                const twoAttempts =
                    Number(
                        game.twoPointersAttempts
                    ) || 0;


                const threeMade =
                    Number(
                        game.threePointersMade
                    ) || 0;


                const threeAttempts =
                    Number(
                        game.threePointersAttempts
                    ) || 0;


                const ftPercentage =
                    getPercentage(
                        ftMade,
                        ftAttempts
                    );


                const twoPercentage =
                    getPercentage(
                        twoMade,
                        twoAttempts
                    );


                const threePercentage =
                    getPercentage(
                        threeMade,
                        threeAttempts
                    );


                /* =========================
                   OLD DATA SUPPORT
                ========================== */

                const isOldGame =
                    game.threePointers !== undefined &&
                    game.threePointersMade === undefined;


                let shootingHTML =
                    "";


                if (isOldGame) {

                    shootingHTML = `

                        <div class="game-old-data">

                            <p>
                                <strong>
                                    Older game format
                                </strong>
                            </p>

                            <p>
                                3PT:
                                ${Number(game.threePointers) || 0}
                            </p>

                            <p>
                                FT:
                                ${Number(game.freeThrows) || 0}
                            </p>

                            <p>
                                Mid-Range:
                                ${Number(game.midRange) || 0}
                            </p>

                            <small>
                                Shooting percentages are unavailable
                                because attempts were not recorded.
                            </small>

                        </div>

                    `;

                } else {

                    shootingHTML = `

                        <div class="game-shooting-history">

                            <div>

                                <strong>
                                    ${ftMade}/${ftAttempts}
                                </strong>

                                <span>
                                    FT
                                </span>

                                <small>
                                    ${ftAttempts > 0
                                        ? ftPercentage.toFixed(1) + "%"
                                        : "—"
                                    }
                                </small>

                            </div>


                            <div>

                                <strong>
                                    ${twoMade}/${twoAttempts}
                                </strong>

                                <span>
                                    2PT
                                </span>

                                <small>
                                    ${twoAttempts > 0
                                        ? twoPercentage.toFixed(1) + "%"
                                        : "—"
                                    }
                                </small>

                            </div>


                            <div>

                                <strong>
                                    ${threeMade}/${threeAttempts}
                                </strong>

                                <span>
                                    3PT
                                </span>

                                <small>
                                    ${threeAttempts > 0
                                        ? threePercentage.toFixed(1) + "%"
                                        : "—"
                                    }
                                </small>

                            </div>

                        </div>

                    `;

                }


                /* =========================
                   CARD
                ========================== */

                card.innerHTML = `

                    <div class="game-history-header">

                        <div>

                            <h3>
                                🏀
                                ${escapeHTML(game.opponent || "Unknown Opponent")}
                            </h3>

                            <p>
                                ${escapeHTML(game.date || "No date")}
                                •
                                ${escapeHTML(game.format || "No format")}
                            </p>

                        </div>

                    </div>


                    <div class="game-history-stats">

                        <div>

                            <strong>
                                ${Number(game.points) || 0}
                            </strong>

                            <span>
                                PTS
                            </span>

                        </div>


                        <div>

                            <strong>
                                ${Number(game.rebounds) || 0}
                            </strong>

                            <span>
                                REB
                            </span>

                        </div>


                        <div>

                            <strong>
                                ${Number(game.assists) || 0}
                            </strong>

                            <span>
                                AST
                            </span>

                        </div>

                    </div>


                    ${shootingHTML}


                    <button
                        class="delete-game-button"
                        data-index="${index}"
                    >
                        Delete
                    </button>

                `;


                gameHistory.appendChild(
                    card
                );

            }
        );


        /* =========================
           DELETE BUTTONS
        ========================== */

        document
            .querySelectorAll(
                ".delete-game-button"
            )
            .forEach(
                function(button) {

                    button.addEventListener(
                        "click",
                        function() {

                            const confirmDeleteGames =
                                localStorage.getItem(
                                    "confirmDeleteGames"
                                ) !== "false";

                            if (
                                confirmDeleteGames &&
                                !window.confirm(
                                    "Delete this game? This cannot be undone."
                                )
                            ) {
                                return;
                            }

                            const index =
                                Number(
                                    this.dataset.index
                                );


                            const games =
                                getGames();


                            games.splice(
                                index,
                                1
                            );


                            localStorage.setItem(
                                "hooptrackGames",
                                JSON.stringify(games)
                            );


                            loadGames();

                        }
                    );

                }
            );

    }


    /* =========================
       SAVE GAME
    ========================== */

    saveGameButton.addEventListener(
        "click",
        function() {

            const opponent =
                gameOpponent.value.trim();


            const format =
                gameFormat.value;


            const date =
                gameDate.value;


            const points =
                Number(
                    gamePoints.value
                ) || 0;


            const rebounds =
                Number(
                    gameRebounds.value
                ) || 0;


            const assists =
                Number(
                    gameAssists.value
                ) || 0;


            const ftMade =
                Number(
                    gameFTMade.value
                ) || 0;


            const ftAttempts =
                Number(
                    gameFTAttempts.value
                ) || 0;


            const twoMade =
                Number(
                    gameTwoMade.value
                ) || 0;


            const twoAttempts =
                Number(
                    gameTwoAttempts.value
                ) || 0;


            const threeMade =
                Number(
                    gameThreeMade.value
                ) || 0;


            const threeAttempts =
                Number(
                    gameThreeAttempts.value
                ) || 0;


            /* =========================
               BASIC VALIDATION
            ========================== */

            if (!opponent) {

                alert(
                    "Please enter an opponent."
                );

                return;

            }


            if (!format) {

                alert(
                    "Please select a game format."
                );

                return;

            }


            if (!date) {

                alert(
                    "Please select a date."
                );

                return;

            }

            if (
                ![
                    points,
                    rebounds,
                    assists,
                    ftMade,
                    ftAttempts,
                    twoMade,
                    twoAttempts,
                    threeMade,
                    threeAttempts
                ].every(isValidNonNegativeNumber)
            ) {
                alert("Game statistics must be non-negative numbers.");
                return;
            }


            /* =========================
               SHOOTING VALIDATION
            ========================== */

            if (ftMade > ftAttempts) {

                alert(
                    "Free throws made cannot be greater than attempts."
                );

                return;

            }


            if (twoMade > twoAttempts) {

                alert(
                    "2-point makes cannot be greater than attempts."
                );

                return;

            }


            if (threeMade > threeAttempts) {

                alert(
                    "3-point makes cannot be greater than attempts."
                );

                return;

            }


            /* =========================
               CREATE GAME
            ========================== */

            const newGame = {

                opponent:
                    opponent,

                format:
                    format,

                date:
                    date,

                points:
                    points,

                rebounds:
                    rebounds,

                assists:
                    assists,

                freeThrowsMade:
                    ftMade,

                freeThrowsAttempts:
                    ftAttempts,

                twoPointersMade:
                    twoMade,

                twoPointersAttempts:
                    twoAttempts,

                threePointersMade:
                    threeMade,

                threePointersAttempts:
                    threeAttempts

            };


            /* =========================
               SAVE
            ========================== */

            const games =
                getGames();


            games.unshift(
                newGame
            );


            localStorage.setItem(
                "hooptrackGames",
                JSON.stringify(games)
            );


            /* =========================
               CLEAR FORM
            ========================== */

            gameOpponent.value =
                "";


            gameFormat.value =
                "";


            gameDate.value =
                "";


            gamePoints.value =
                "";


            gameRebounds.value =
                "";


            gameAssists.value =
                "";


            gameFTMade.value =
                "";


            gameFTAttempts.value =
                "";


            gameTwoMade.value =
                "";


            gameTwoAttempts.value =
                "";


            gameThreeMade.value =
                "";


            gameThreeAttempts.value =
                "";


            /* =========================
               MESSAGE
            ========================== */

            if (gameSaveMessage) {

                gameSaveMessage.textContent =
                    "Game saved successfully!";

            }


            loadGames();


            setTimeout(
                function() {

                    if (gameSaveMessage) {

                        gameSaveMessage.textContent =
                            "";

                    }

                },
                2500
            );

        }
    );


    /* =========================
       START GAME TRACKER
    ========================== */

    loadGames();

}


/* =====================================================
   UPDATE DASHBOARD WHEN LOCAL STORAGE CHANGES
===================================================== */

window.addEventListener(
    "storage",
    function(event) {

        if (
            event.key ===
            "hooptrackGames"
        ) {

            loadDashboard();
            loadPerformanceAnalytics();

        }

    }
);


/* =====================================================
   SETTINGS
===================================================== */

const settingsStatus =
    document.querySelector("#settings-status");

function showSettingsStatus(message) {
    if (settingsStatus) {
        settingsStatus.textContent = message;
    }
}

const showTrainingTipsToggle =
    document.querySelector("#show-training-tips");

if (showTrainingTipsToggle) {
    showTrainingTipsToggle.checked =
        localStorage.getItem("showTrainingTips") !== "false";

    showTrainingTipsToggle.addEventListener(
        "change",
        function() {
            localStorage.setItem(
                "showTrainingTips",
                showTrainingTipsToggle.checked
            );
            showSettingsStatus("Training tip preference saved.");
        }
    );
}

const confirmDeleteGamesToggle =
    document.querySelector("#confirm-delete-games");

if (confirmDeleteGamesToggle) {
    confirmDeleteGamesToggle.checked =
        localStorage.getItem("confirmDeleteGames") !== "false";

    confirmDeleteGamesToggle.addEventListener(
        "change",
        function() {
            localStorage.setItem(
                "confirmDeleteGames",
                confirmDeleteGamesToggle.checked
            );
            showSettingsStatus("Delete confirmation preference saved.");
        }
    );
}

const resetTrainingButton =
    document.querySelector("#reset-training-button");

if (resetTrainingButton) {
    resetTrainingButton.addEventListener(
        "click",
        function() {
            Object.keys(localStorage).forEach(function(key) {
                if (key.startsWith("original-task")) {
                    localStorage.setItem(key, "false");
                }
            });

            const customExercises = getCustomExercises().map(function(exercise) {
                exercise.completed = false;
                return exercise;
            });

            localStorage.setItem(
                "customExercises",
                JSON.stringify(customExercises)
            );
            showSettingsStatus("Today's training has been reset.");
        }
    );
}

const exportDataButton =
    document.querySelector("#export-data-button");

if (exportDataButton) {
    exportDataButton.addEventListener(
        "click",
        function() {
            const data = {};
            Object.keys(localStorage).forEach(function(key) {
                data[key] = localStorage.getItem(key);
            });

            const file = new Blob(
                [JSON.stringify(data, null, 2)],
                { type: "application/json" }
            );
            const link = document.createElement("a");
            link.href = URL.createObjectURL(file);
            link.download = "hooptrack-data.json";
            link.click();
            URL.revokeObjectURL(link.href);
            showSettingsStatus("Your HoopTrack data was exported.");
        }
    );
}

const importDataButton =
    document.querySelector("#import-data-button");
const importDataInput =
    document.querySelector("#import-data-input");

if (importDataButton && importDataInput) {
    importDataButton.addEventListener("click", function() {
        importDataInput.click();
    });

    importDataInput.addEventListener(
        "change",
        function() {
            const file = importDataInput.files[0];
            if (!file) {
                return;
            }

            const reader = new FileReader();
            reader.onload = function() {
                try {
                    const data = JSON.parse(reader.result);
                    if (!data || typeof data !== "object" || Array.isArray(data)) {
                        throw new Error("Invalid data");
                    }

                    const hoopTrackKeys = [
                        "customExercises",
                        "hooptrackGames",
                        "shootingHistory",
                        "points",
                        "freeThrowsMade",
                        "freeThrowsAttempts",
                        "threePointersMade",
                        "threePointersAttempts",
                        "rebounds",
                        "assists",
                        "showTrainingTips",
                        "confirmDeleteGames"
                    ];

                    Object.keys(data).forEach(function(key) {
                        const isOriginalTask =
                            key.startsWith("original-task");

                        if (
                            !hoopTrackKeys.includes(key) &&
                            !isOriginalTask
                        ) {
                            throw new Error("Unknown data key");
                        }

                        if (
                            data[key] !== null &&
                            typeof data[key] === "object"
                        ) {
                            throw new Error("Invalid data value");
                        }
                    });

                    clearHoopTrackData();
                    Object.keys(data).forEach(function(key) {
                        if (
                            hoopTrackKeys.includes(key) ||
                            key.startsWith("original-task")
                        ) {
                            localStorage.setItem(key, String(data[key]));
                        }
                    });
                    showSettingsStatus("Data imported. Refreshing HoopTrack...");
                    window.setTimeout(function() {
                        window.location.reload();
                    }, 500);
                } catch (error) {
                    showSettingsStatus("That file is not valid HoopTrack data.");
                }
            };
            reader.readAsText(file);
        }
    );
}

const resetAllDataButton =
    document.querySelector("#reset-all-data-button");

if (resetAllDataButton) {
    resetAllDataButton.addEventListener(
        "click",
        function() {
            if (window.confirm("Reset all HoopTrack data? This cannot be undone.")) {
                clearHoopTrackData();
                showSettingsStatus("All data was reset. Refreshing HoopTrack...");
                window.setTimeout(function() {
                    window.location.reload();
                }, 500);
            }
        }
    );
}
