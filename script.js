// 1. DATI DI DEFAULT E SCENARI
const DEFAULT_DATA = {
    kpis: { users: 1200, counters: 12, avgTime: 6 },
    targets: { users: 1200, counters: 12, avgTime: 6 },
    costs: [
        { name: 'Server Web / Frontend', qty: 3, unit: 120.0, total: 360.0 },
        { name: 'Server Database', qty: 2, unit: 250.0, total: 500.0 },
        { name: 'Load Balancer', qty: 1, unit: 80.0, total: 80.0 },
        { name: 'Storage Dati NAS/SAN', qty: 1, unit: 150.0, total: 150.0 },
        { name: 'API Gateway', qty: 1, unit: 90.0, total: 90.0 }
    ],
    queues: [
        { h: '08:00', arrival: 60 }, { h: '09:00', arrival: 140 }, { h: '10:00', arrival: 190 },
        { h: '11:00', arrival: 150 }, { h: '12:00', arrival: 90 }, { h: '13:00', arrival: 210 },
        { h: '14:00', arrival: 110 }, { h: '15:00', arrival: 80 }, { h: '16:00', arrival: 70 },
        { h: '17:00', arrival: 60 }, { h: '18:00', arrival: 40 }
    ],
    traffic: [
        { h: '08:00', users: 25 }, { h: '09:00', users: 56 }, { h: '10:00', users: 76 },
        { h: '11:00', users: 60 }, { h: '12:00', users: 36 }, { h: '13:00', users: 84 },
        { h: '14:00', users: 44 }, { h: '15:00', users: 32 }, { h: '16:00', users: 28 },
        { h: '17:00', users: 24 }, { h: '18:00', users: 16 }
    ],
    multiplier: 100
};

const SCENARIOS = [
    {
        id: 'default',
        name: 'Standard (CSV)',
        desc: 'Configurazione originale basata sui dati medi del file Poste.xlsx.',
        load: 'Basso',
        data: DEFAULT_DATA
    },
    {
        id: 'sottodimensionamento',
        name: 'Sottodimensionamento',
        desc: 'Riduzione critica degli sportelli e aumento tempi di servizio.',
        load: 'Critico',
        data: {
            kpis: { users: 400, counters: 4, avgTime: 10 },
            targets: { users: 400, counters: 4, avgTime: 10 },
            costs: [{ unit: 80 }, { unit: 200 }, { unit: 60 }, { unit: 100 }, { unit: 50 }],
            traffic: [{ h: '08:00', users: 15 }, { h: '11:00', users: 45 }, { h: '14:00', users: 30 }, { h: '18:00', users: 10 }]
        }
    },
    {
        id: 'black_friday',
        name: 'Black Friday',
        desc: 'Massima operatività con afflusso di utenti record.',
        load: 'Alto',
        data: {
            kpis: { users: 3000, counters: 20, avgTime: 4 },
            targets: { users: 3000, counters: 20, avgTime: 4 },
            costs: [{ unit: 150 }, { unit: 400 }, { unit: 100 }, { unit: 200 }, { unit: 120 }],
            traffic: [{ h: '08:00', users: 300 }, { h: '10:00', users: 750 }, { h: '12:00', users: 950 }, { h: '14:00', users: 600 }]
        }
    },
    {
        id: 'cloud_premium',
        name: 'Cloud Premium',
        desc: 'Infrastruttura potenziata con costi IT maggiorati.',
        load: 'Medio',
        data: {
            kpis: { users: 1500, counters: 15, avgTime: 5 },
            targets: { users: 1500, counters: 15, avgTime: 5 },
            costs: [{ unit: 300 }, { unit: 700 }, { unit: 150 }, { unit: 300 }, { unit: 200 }],
            traffic: [{ h: '08:00', users: 55 }, { h: '12:00', users: 185 }, { h: '16:00', users: 120 }, { h: '20:00', users: 65 }]
        }
    },
    {
        id: 'stress_test',
        name: 'Stress Test',
        desc: 'Scenario limite per testare la tenuta totale dei sistemi.',
        load: 'Estremo',
        data: {
            kpis: { users: 5000, counters: 2, avgTime: 15 },
            targets: { users: 5000, counters: 2, avgTime: 15 },
            costs: [{ unit: 1000 }, { unit: 2000 }, { unit: 300 }, { unit: 500 }, { unit: 400 }],
            traffic: [{ h: '08:00', users: 200 }, { h: '13:00', users: 1500 }, { h: '18:00', users: 200 }]
        }
    }
];

let appState = JSON.parse(JSON.stringify(DEFAULT_DATA));
let queueChart, trafficChart;

document.addEventListener('DOMContentLoaded', () => {
    loadParamsFromJS();
    renderScenariList();
    initEditPanel();
    updateUI();
});

function renderScenariList() {
    const list = document.getElementById('scenari-list');
    list.innerHTML = '';
    SCENARIOS.forEach(s => {
        const card = document.createElement('div');
        card.className = 'scenario-card';
        const tagClass = s.load === 'Basso' ? 'load-low' : (s.load === 'Medio' ? 'load-mid' : 'load-high');
        card.innerHTML = `
            <h3>${s.name}</h3>
            <span class="tag ${tagClass}">Carico: ${s.load}</span>
            <p>${s.desc}</p>
        `;
        card.onclick = () => activateScenario(s.id);
        list.appendChild(card);
    });
}

function activateScenario(id) {
    const s = SCENARIOS.find(x => x.id === id);
    if (!s) return;

    // Deep copy dei dati dello scenario
    const newData = JSON.parse(JSON.stringify(s.data));
    
    // Merge con lo stato corrente (mantenendo i default per i campi mancanti)
    appState = JSON.parse(JSON.stringify(DEFAULT_DATA));
    
    if (newData.kpis) Object.assign(appState.kpis, newData.kpis);
    if (newData.targets) Object.assign(appState.targets, newData.targets);
    if (newData.costs) {
        newData.costs.forEach((c, i) => {
            if (appState.costs[i]) Object.assign(appState.costs[i], c);
        });
    }
    if (newData.queues) appState.queues = newData.queues;
    if (newData.traffic) appState.traffic = newData.traffic;
    if (newData.multiplier !== undefined) appState.multiplier = newData.multiplier;

    initEditPanel();
    updateUI();
    showSection('home');
}

function showSection(id) {
    document.querySelectorAll('main').forEach(m => m.style.display = 'none');
    document.getElementById(`section-${id}`).style.display = 'block';
    
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    document.getElementById(`btn-${id}`).classList.add('active');

    if (id === 'home') updateUI();
}

function loadParamsFromJS() {
    if (typeof window.CMD_PARAMS !== 'undefined') {
        const p = window.CMD_PARAMS;
        if (p.users) { appState.kpis.users = p.users; appState.targets.users = p.users; }
        if (p.counters) { appState.kpis.counters = p.counters; appState.targets.counters = p.counters; }
        if (p.avgTime) { appState.kpis.avgTime = p.avgTime; appState.targets.avgTime = p.avgTime; }
        if (p.multiplier) appState.multiplier = p.multiplier;
        if (p.web) appState.costs[0].unit = p.web;
        if (p.db) appState.costs[1].unit = p.db;
        if (p.queues) appState.queues = p.queues;
        if (p.traffic) appState.traffic = p.traffic;
        appState.costs.forEach(c => c.total = c.qty * c.unit);
    }
}

function initEditPanel() {
    document.getElementById('input-users').value = appState.kpis.users;
    document.getElementById('input-counters').value = appState.kpis.counters;
    document.getElementById('input-avg-time').value = appState.kpis.avgTime;
    document.getElementById('cost-web').value = appState.costs[0].unit;
    document.getElementById('cost-db').value = appState.costs[1].unit;
    document.getElementById('cost-lb').value = appState.costs[2].unit;
    document.getElementById('cost-storage').value = appState.costs[3].unit;
    document.getElementById('cost-api').value = appState.costs[4].unit;
    document.getElementById('input-multiplier').value = appState.multiplier;
    document.getElementById('multiplier-val').textContent = appState.multiplier;
}

function updateData() {
    appState.kpis.users = parseInt(document.getElementById('input-users').value) || 0;
    appState.kpis.counters = parseInt(document.getElementById('input-counters').value) || 0;
    appState.kpis.avgTime = parseInt(document.getElementById('input-avg-time').value) || 0;
    appState.costs[0].unit = parseFloat(document.getElementById('cost-web').value) || 0;
    appState.costs[1].unit = parseFloat(document.getElementById('cost-db').value) || 0;
    appState.costs[2].unit = parseFloat(document.getElementById('cost-lb').value) || 0;
    appState.costs[3].unit = parseFloat(document.getElementById('cost-storage').value) || 0;
    appState.costs[4].unit = parseFloat(document.getElementById('cost-api').value) || 0;
    appState.costs.forEach(c => c.total = c.qty * c.unit);
    appState.multiplier = parseInt(document.getElementById('input-multiplier').value);
    document.getElementById('multiplier-val').textContent = appState.multiplier;
}

function updateUI() {
    const capacity = appState.kpis.counters * (60 / appState.kpis.avgTime);
    document.getElementById('kpi-users').textContent = appState.kpis.users;
    document.getElementById('kpi-counters').textContent = appState.kpis.counters;
    document.getElementById('kpi-avg-time').textContent = appState.kpis.avgTime + " min";
    document.getElementById('kpi-capacity').textContent = Math.round(capacity);
    document.getElementById('target-users').textContent = appState.targets.users;
    document.getElementById('target-counters').textContent = appState.targets.counters;
    document.getElementById('target-avg-time').textContent = appState.targets.avgTime + " min";

    const infraBody = document.getElementById('infra-body');
    infraBody.innerHTML = '';
    let grandTotal = 0;
    appState.costs.forEach(c => {
        const row = document.createElement('tr');
        row.innerHTML = `<td>${c.name}</td><td>${c.qty}</td><td>€${c.unit.toFixed(2)}</td><td>€${c.total.toFixed(2)}</td>`;
        infraBody.appendChild(row);
        grandTotal += c.total;
    });
    document.getElementById('total-cost').textContent = `€${grandTotal.toFixed(2)}`;
    renderCharts(capacity);
    renderAlerts(capacity);
}

function resetToDefault() {
    activateScenario('default');
    alert("Dati ripristinati!");
}

function renderCharts(capacity) {
    if (queueChart) queueChart.destroy();
    if (trafficChart) trafficChart.destroy();
    const m = appState.multiplier / 100;
    const ctxQ = document.getElementById('queueChart').getContext('2d');
    queueChart = new Chart(ctxQ, {
        type: 'bar',
        data: {
            labels: appState.queues.map(q => q.h),
            datasets: [
                { label: 'Afflusso Utenti (λ)', data: appState.queues.map(q => q.arrival * m), backgroundColor: '#004B8E' },
                { label: 'Capacità (μ)', data: new Array(appState.queues.length).fill(capacity), type: 'line', borderColor: '#FFCB00', fill: false }
            ]
        },
        options: { responsive: true, animation: false }
    });
    const ctxT = document.getElementById('trafficChart').getContext('2d');
    trafficChart = new Chart(ctxT, {
        type: 'line',
        data: {
            labels: appState.traffic.map(t => t.h),
            datasets: [{ 
                label: 'Utenti Concorrenti', 
                data: appState.traffic.map(t => t.users * m), 
                borderColor: '#28a745', 
                backgroundColor: 'rgba(40, 167, 69, 0.1)', 
                fill: true 
            }]
        },
        options: { responsive: true, animation: false }
    });
}

function renderAlerts(capacity) {
    const list = document.getElementById('alerts-list');
    list.innerHTML = '';
    const m = appState.multiplier / 100;
    const maxArrival = Math.max(...appState.queues.map(q => q.arrival * m));
    if (maxArrival > capacity) {
        const div = document.createElement('div');
        div.className = 'alert danger';
        div.textContent = `CRITICO: Picco di traffico (${Math.round(maxArrival)}) superiore alla capacità (${Math.round(capacity)}).`;
        list.appendChild(div);
    } else {
        const div = document.createElement('div');
        div.className = 'alert warning';
        div.textContent = 'Sistema stabile: Carico entro i limiti operativi.';
        list.appendChild(div);
    }
}
