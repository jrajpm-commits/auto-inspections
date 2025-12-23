// helpSystem.js - Minimal help system
class HelpSystem {
    constructor() {
        this.helpData = {};
        this.helpEnabled = false;
        this.tooltip = null;
        this.init();
    }

    async init() {
        // Create tooltip
        this.tooltip = document.createElement('div');
        this.tooltip.className = 'help-tooltip';
        document.body.appendChild(this.tooltip);
        
        // Add toggle button
        this.addToggleButton();
        
        // Load help data
        try {
            const response = await fetch('helpData.json');
            this.helpData = await response.json();
            console.log('Help data loaded successfully');
        } catch (error) {
            console.error('Failed to load help data:', error);
            this.helpData = this.createFallbackData();
        }
        
        // Map elements to help data
        this.createHelpMapping();
        
        // Handle tooltip positioning
        document.addEventListener('mousemove', (e) => this.positionTooltip(e));
    }

    addToggleButton() {
        const button = document.createElement('button');
        button.className = 'help-toggle';
        button.innerHTML = '🔍 Help Mode: OFF';
        button.onclick = () => this.toggleHelp();
        document.body.appendChild(button);
        this.toggleButton = button;
    }

    toggleHelp() {
        this.helpEnabled = !this.helpEnabled;
        
        if (this.helpEnabled) {
            document.body.classList.add('help-icons-visible');
            this.toggleButton.innerHTML = '🔍 Help Mode: ON';
            this.toggleButton.style.background = '#4CAF50';
        } else {
            document.body.classList.remove('help-icons-visible');
            this.toggleButton.innerHTML = '🔍 Help Mode: OFF';
            this.toggleButton.style.background = '#2196F3';
            this.hideTooltip();
        }
    }

    createHelpMapping() {
        // Capability headers
        this.mapHelpIcons('.capability-header h2', (el, i) => `cap${i+1}`, 'capabilities');
        
        // Sensor cards
        this.mapHelpIcons('.sensor-card h4', (el, i) => 
            i === 0 ? 'sensor' : i === 1 ? 'vision' : 'process', 'cards');
        
        // Grade cards
        this.mapHelpIcons('.grade-card .grade-label', (el, i) => 
            i === 0 ? 'safetyScore' : i === 1 ? 'dataQuality' : 'completeness', 'grades');
        
        // Threshold controls
        this.mapHelpIcons('.threshold-controls h4', () => 'thresholds', 'dashboard');
        
        // Workflow panel
        this.mapHelpIcons('.workflow-panel h3', () => 'workflow', 'dashboard');
        
        // Conversion panel
        this.mapHelpIcons('.conversion-panel h3', () => 'conversion', 'dashboard');
        
        // KPI cards
        this.mapHelpIcons('.kpi-card .kpi-header h4', () => 'kpi', 'dashboard');
        
        // Prediction panel
        this.mapHelpIcons('.prediction-panel h3', () => 'prediction', 'dashboard');
        
        // Optimization panel
        this.mapHelpIcons('.optimization-panel h3', () => 'optimization', 'dashboard');
    }

    mapHelpIcons(selector, keyFn, category) {
        document.querySelectorAll(selector).forEach((element, index) => {
            const helpKey = keyFn(element, index);
            const icon = document.createElement('span');
            icon.className = 'help-icon';
            icon.textContent = 'i';
            icon.dataset.category = category;
            icon.dataset.key = helpKey;
            
            icon.addEventListener('mouseover', (e) => this.showTooltip(e, category, helpKey));
            icon.addEventListener('mouseout', () => this.hideTooltip());
            
            element.appendChild(icon);
        });
    }

    showTooltip(event, category, key) {
        if (!this.helpEnabled) return;
        
        const data = this.getHelpData(category, key);
        if (!data) return;
        
        let html = `<h4>${data.title}</h4>`;
        html += `<p><strong>What is it:</strong> ${data.description}</p>`;
        html += `<p><strong>Formula/Calculation:</strong> ${data.formula}</p>`;
        html += `<p><strong>Why this formula:</strong> ${data.whyThisFormula}</p>`;
        html += `<p><strong>Where to get data:</strong> ${data.whereToGetData}</p>`;
        html += `<p><strong>What to get from data:</strong> ${data.whatToGetFrom}</p>`;
        html += `<p><strong>Logic behind this:</strong> ${data.logic}</p>`;
        html += `<p><strong>Other possible logic:</strong> ${data.otherLogic}</p>`;
        html += `<p><strong>Purpose:</strong> ${data.purpose}</p>`;
        
        this.tooltip.innerHTML = html;
        this.tooltip.classList.add('visible');
        this.positionTooltip(event);
    }

    hideTooltip() {
        this.tooltip.classList.remove('visible');
    }

    positionTooltip(event) {
        if (!this.tooltip.classList.contains('visible')) return;
        
        const x = event.clientX;
        const y = event.clientY;
        const tooltipWidth = this.tooltip.offsetWidth;
        const tooltipHeight = this.tooltip.offsetHeight;
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        
        let left = x + 15;
        let top = y - tooltipHeight - 10;
        
        // Adjust if going off screen
        if (left + tooltipWidth > windowWidth) left = x - tooltipWidth - 15;
        if (top < 0) top = y + 25;
        if (left < 0) left = 10;
        if (top + tooltipHeight > windowHeight) top = windowHeight - tooltipHeight - 10;
        
        this.tooltip.style.left = left + 'px';
        this.tooltip.style.top = top + 'px';
    }

    getHelpData(category, key) {
        return this.helpData[category]?.[key] || null;
    }

    createFallbackData() {
        return {
            capabilities: {},
            cards: {},
            grades: {},
            dashboard: {}
        };
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.helpSystem = new HelpSystem();
});