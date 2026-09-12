const originalQuestions = [
    {
        id: 1,
        text: "During a reporting pipeline review, a data engineer transforms an Oracle table containing two related JSON arrays per row. Both arrays must be expanded for downstream comparison without generating a Cartesian-style row explosion. To preserve position-wise alignment across both arrays, the team requires the positional matching condition to be defined directly in the correlated join logic. Which rewrite should be selected?",
        options: [
            { id: "A", text: "Use OUTER APPLY placing ordinality match inside the join clause" },
            { id: "B", text: "Use CROSS APPLY placing ordinality match inside the FROM block" },
            { id: "C", text: "Use CROSS JOIN placing ordinality match inside the join clause" },
            { id: "D", text: "Use INNER JOIN LATERAL placing ordinality match inside the join" }
        ],
        selectedOption: null
    },
    {
        id: 2,
        text: "A training platform stores user profiles in one table and course completion records in another table. The operations team wants a list of learners who enrolled but have not completed any course yet. The report must include every learner from the enrollment table, even when no matching completion record exists. Which SQL approach is most suitable for this requirement?",
        options: [
            { id: "A", text: "CROSS JOIN with row check" },
            { id: "B", text: "LEFT JOIN with null check" },
            { id: "C", text: "INNER JOIN with count check" },
            { id: "D", text: "SELF JOIN with alias check" }
        ],
        selectedOption: null
    },
    {
        id: 3,
        text: "A warehouse routing service must compute the minimum moves to visit every pickup point on a blocked grid where the robot may revisit the same cell later if that revisit reflects a different collection progress. Which state should the BFS planner uniquely store for correctness?",
        options: [
            { id: "A", text: "Previous cell with depth" },
            { id: "B", text: "Current cell with collected items bitmask" },
            { id: "C", text: "Current cell with path history list" },
            { id: "D", text: "Previous cell with remaining items count" }
        ],
        selectedOption: null
    }
];

const questions = [...originalQuestions];

// Generate the remaining questions up to 40
const topics = [
    { sub: "Database Indexing", opt: ["Improves insertion speed", "Speeds up data retrieval", "Reduces memory usage", "Encrypts data at rest"], ans: "B" },
    { sub: "Java Garbage Collection", opt: ["Deletes unreferenced objects", "Compiles source code", "Manages thread states", "Allocates raw memory blocks"], ans: "A" },
    { sub: "React Virtual DOM", opt: ["Modifies actual DOM directly", "Keeps a lightweight in-memory representation", "Fetches data from API", "Manages local storage"], ans: "B" },
    { sub: "Cloud Auto-scaling", opt: ["Automatically provisions instances based on load", "Limits database read capacity", "Decreases network latency by caching", "Prevents DDoS attacks automatically"], ans: "A" },
    { sub: "Git Version Control", opt: ["Compiles code to binary", "Tracks changes in source code files", "Hosts databases", "Serves web applications"], ans: "B" }
];

for (let i = 4; i <= 40; i++) {
    const topic = topics[i % topics.length];
    questions.push({
        id: i,
        text: `Technical Question ${i}: Regarding the subject of ${topic.sub}, which statement correctly defines its core purpose in an enterprise engineering environment?`,
        options: [
            { id: "A", text: `${topic.opt[0]} (Option derived context A)` },
            { id: "B", text: `${topic.opt[1]} (Option derived context B)` },
            { id: "C", text: `${topic.opt[2]} (Option derived context C)` },
            { id: "D", text: `${topic.opt[3]} (Option derived context D)` }
        ],
        selectedOption: null
    });
}

const QUESTIONS_PER_PAGE = 4;
let currentPageIndex = 0;
let currentSection = 'technical';
let subjectiveAnswer = "";

function forceFullscreen() {
    const elem = document.documentElement;
    if (!document.fullscreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement) {
        if (elem.requestFullscreen) {
            elem.requestFullscreen().catch(err => console.log("Fullscreen blocked", err));
        } else if (elem.webkitRequestFullscreen) { 
            elem.webkitRequestFullscreen();
        } else if (elem.msRequestFullscreen) {
            elem.msRequestFullscreen();
        }
    }
}

function toggleFullscreen() {
    if (!document.fullscreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement) {
        const elem = document.documentElement;
        if (elem.requestFullscreen) {
            elem.requestFullscreen().catch(err => console.log(err));
        } else if (elem.webkitRequestFullscreen) {
            elem.webkitRequestFullscreen();
        } else if (elem.msRequestFullscreen) {
            elem.msRequestFullscreen();
        }
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen().catch(err => console.log(err));
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
    }
}

function switchSection(sectionName) {
    forceFullscreen(); // Force fullscreen any time they switch sections
    
    currentSection = sectionName;
    
    // Update sidebar UI
    document.getElementById('tab-technical').classList.remove('active');
    document.getElementById('tab-subjective').classList.remove('active');
    document.getElementById(`tab-${sectionName}`).classList.add('active');
    
    renderContainer();
}

function renderContainer() {
    const container = document.getElementById('question-container');
    container.innerHTML = ''; 

    if (currentSection === 'technical') {
        renderTechnical(container);
    } else if (currentSection === 'subjective') {
        renderSubjective(container);
    }
}

function renderTechnical(container) {
    const startIndex = currentPageIndex * QUESTIONS_PER_PAGE;
    const endIndex = Math.min(startIndex + QUESTIONS_PER_PAGE, questions.length);
    const pageQuestions = questions.slice(startIndex, endIndex);

    pageQuestions.forEach(q => {
        const qDiv = document.createElement('div');
        qDiv.className = 'question';

        let optionsHtml = '';
        q.options.forEach(opt => {
            const isChecked = q.selectedOption === opt.id ? 'checked' : '';
            optionsHtml += `
                <label class="option-label ${isChecked ? 'selected' : ''}">
                    <input type="radio" name="q${q.id}" value="${opt.id}" ${isChecked} onchange="selectOption(${q.id}, '${opt.id}')">
                    ${opt.id}. ${opt.text}
                </label>
            `;
        });

        qDiv.innerHTML = `
            <p><strong>Q ${q.id}.</strong> ${q.text}</p>
            <div class="options">
                ${optionsHtml}
            </div>
        `;
        container.appendChild(qDiv);
    });

    // Sub-navigation buttons for technical pages
    const navDiv = document.createElement('div');
    navDiv.className = 'action-buttons';
    navDiv.style.marginTop = '40px';
    
    const isLastPage = endIndex >= questions.length;

    navDiv.innerHTML = `
        <div style="width: 100%; display: flex; justify-content: space-between;">
            ${currentPageIndex > 0 ? `<button class="nav-btn prev-btn" onclick="prevPage()">Previous Page</button>` : '<div></div>'}
            ${!isLastPage ? 
                `<button class="nav-btn next-btn" onclick="nextPage()">Save & Next Page</button>` : 
                `<button class="nav-btn next-btn sumbit-final-btn" onclick="submitTechnical()">Submit & Go to Subjective</button>`
            }
        </div>
    `;
    
    container.appendChild(navDiv);

    // We no longer print Section Navigation here per requirements.
    // addSectionNavButtons(container, 'technical');

    document.querySelector('.content-area').scrollTo(0, 0);
    updateStats();
}

function submitTechnical() {
    // Ensure we are in fullscreen or request it again immediately before ANY other action
    const elem = document.documentElement;
    if (elem.requestFullscreen) {
        elem.requestFullscreen().catch(err => console.log("Already in fullscreen or blocked", err));
    } else if (elem.webkitRequestFullscreen) { 
        elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) {
        elem.msRequestFullscreen();
    }

    // Proceed to subjective
    document.getElementById('tab-subjective').style.display = 'block';
    
    // Lock the technical tab
    document.getElementById('tab-technical').onclick = null;
    document.getElementById('tab-technical').style.opacity = '0.5';
    document.getElementById('tab-technical').style.cursor = 'not-allowed';
    
    switchSection('subjective');
}

function updateSubjectiveStats() {
    const wordCount = subjectiveAnswer.trim().split(/\s+/).filter(word => word.length > 0).length;
    document.getElementById('subjective-stats-text').innerText = (wordCount >= 100 ? "01 / 01 attempted" : "00 / 01 attempted");
}

function onSubjectiveInput(event) {
    subjectiveAnswer = event.target.value;
    const wordCount = subjectiveAnswer.trim().split(/\s+/).filter(word => word.length > 0).length;
    document.getElementById('word-count-display').innerText = `Words : ${wordCount}, Minimum Words : 100, Maximum Words : 241`;
    document.getElementById('save-status-display').innerText = `saved at ${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`;
    updateSubjectiveStats();
    updateGlobalSubmit();
}

function renderSubjective(container) {
    const wordCount = subjectiveAnswer.trim().split(/\s+/).filter(word => word.length > 0).length;
    
    container.innerHTML = `
        <div class="subjective-header">
            <h2>01. Subjective</h2>
            <span class="marks-label">20 marks</span>
        </div>
        
        <div class="subjective-question-text">
            <span>Q 06. Please write your views on the topic given below in 100 - 241 words. Note that a write-up under 100 words will not be evaluated.</span>
            <h4>Is global warming a cause for concern? Why or why not?</h4>
        </div>
        
        <div class="textarea-container">
            <span class="ans-label">Ans:</span>
            <div class="textarea-wrapper">
                <textarea class="subjective-textarea" oninput="onSubjectiveInput(event)" placeholder="Start typing here...">${subjectiveAnswer}</textarea>
                <div class="textarea-footer">
                    <span class="word-stats" id="word-count-display">(Words : ${wordCount}, Minimum Words : 100, Maximum Words : 241)</span>
                    <span class="save-status" id="save-status-display">saved at ${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                </div>
            </div>
        </div>
    `;
    
    // Global Section Navigation at very bottom
    addSectionNavButtons(container, 'subjective');
    updateSubjectiveStats();
}

function addSectionNavButtons(container, sectionName) {
    const sectionNav = document.createElement('div');
    sectionNav.className = 'section-nav-footer';
    
    if (sectionName === 'technical') {
        sectionNav.innerHTML = `
            <button class="section-nav-btn" disabled>Previous Section</button>
            <button class="section-nav-btn active" onclick="switchSection('subjective')">Next Section</button>
        `;
    } else if (sectionName === 'subjective') {
        sectionNav.innerHTML = `
            <button class="section-nav-btn active" onclick="switchSection('technical')">Previous Section</button>
            <button class="section-nav-btn" disabled>Next Section</button>
        `;
    }
    container.appendChild(sectionNav);
}

function selectOption(qId, selectedValue) {
    const q = questions.find(question => question.id === qId);
    if (q) {
        q.selectedOption = selectedValue;
        updateStats(); 
        
        const inputs = document.querySelectorAll(`input[name="q${qId}"]`);
        inputs.forEach(input => {
            const label = input.closest('.option-label');
            if (input.value === selectedValue) {
                label.classList.add('selected');
            } else {
                label.classList.remove('selected');
            }
        });
    }
}

function resetOption(qId) {
    const q = questions.find(question => question.id === qId);
    if (q) {
        q.selectedOption = null;
        renderContainer(); 
    }
}

function nextPage() {
    const maxPageIndex = Math.ceil(questions.length / QUESTIONS_PER_PAGE) - 1;
    if (currentPageIndex < maxPageIndex) {
        currentPageIndex++;
        renderContainer();
    }
}

function prevPage() {
    if (currentPageIndex > 0) {
        currentPageIndex--;
        renderContainer();
    }
}

function updateStats() {
    const attemptedCount = questions.filter(q => q.selectedOption !== null).length;
    const totalCount = questions.length;
    
    document.getElementById('stats-text').innerText = `${totalCount} / ${attemptedCount.toString().padStart(2, '0')} attempted`;
    
    updateGlobalSubmit();
}

function updateGlobalSubmit() {
    const techAttempted = questions.filter(q => q.selectedOption !== null).length;
    const isTechComplete = techAttempted === questions.length;
    
    const wordCount = subjectiveAnswer.trim().split(/\s+/).filter(word => word.length > 0).length;
    const isSubjComplete = wordCount >= 100;

    const globalSubmitBtn = document.getElementById('global-submit');
    if (isTechComplete && isSubjComplete) {
        globalSubmitBtn.disabled = false;
    } else {
        globalSubmitBtn.disabled = true;
    }
}

function submitExam() {
    alert("Assessment Submitted Successfully!");
}

let timerInterval;

function startExamFullscreen() {
    const elem = document.documentElement;
    if (elem.requestFullscreen) {
        elem.requestFullscreen().catch(err => console.log("Fullscreen request failed:", err));
    } else if (elem.webkitRequestFullscreen) { 
        elem.webkitRequestFullscreen();
    } else if (elem.mozRequestFullScreen) {
        elem.mozRequestFullScreen();
    } else if (elem.msRequestFullscreen) {
        elem.msRequestFullscreen();
    }
    
    document.getElementById('start-overlay').style.display = 'none';
    
    timerInterval = setInterval(updateTimer, 1000);
    updateTimer(); 
}

let timeRemaining = 45 * 60; 

function updateTimer() {
    const min = Math.floor(timeRemaining / 60);
    const sec = timeRemaining % 60;
    document.getElementById('timer-display').innerText = `${min} : ${sec.toString().padStart(2, '0')}`;
    
    if (timeRemaining > 0) {
        timeRemaining--;
    } else {
        clearInterval(timerInterval);
        submitExam(); 
    }
}

// Initialize
renderContainer();
