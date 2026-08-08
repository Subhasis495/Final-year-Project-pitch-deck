// HydroShield AI - Tailwind configuration
tailwind = window.tailwind = window.tailwind || {};
tailwind.config = {
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                brand: {
                    50: '#f0f9ff',
                    100: '#e0f2fe',
                    400: '#38bdf8',
                    500: '#0ea5e9',
                    600: '#0284c7',
                    900: '#0c4a6e',
                },
                cyber: {
                    dark: '#0a0f1d',
                    card: '#111827',
                    border: '#1f2937',
                    accent: '#06b6d4',
                    emerald: '#10b981',
                    warning: '#f59e0b',
                    danger: '#ef4444'
                }
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                mono: ['JetBrains Mono', 'monospace']
            }
        }
    }
};

// HydroShield AI - Interactive functionality
window.onload = function() {
            
            // 1. Initialize Chart.js River Discharge Chart
            const ctx = document.getElementById('dischargeChart').getContext('2d');
            const dischargeChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'],
                    datasets: [
                        {
                            label: 'Forecasted Flow (m³/s)',
                            data: [95, 110, 142, 189, 210, 175, 130],
                            borderColor: '#ef4444',
                            backgroundColor: 'rgba(239, 68, 68, 0.15)',
                            fill: true,
                            tension: 0.4,
                            borderWidth: 2,
                            pointRadius: 4,
                            pointBackgroundColor: '#ef4444'
                        },
                        {
                            label: 'Safety Threshold (m³/s)',
                            data: [150, 150, 150, 150, 150, 150, 150],
                            borderColor: '#f59e0b',
                            borderDash: [5, 5],
                            borderWidth: 1.5,
                            pointRadius: 0,
                            fill: false
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            labels: { color: '#9ca3af', font: { family: 'JetBrains Mono', size: 10 } }
                        }
                    },
                    scales: {
                        x: {
                            grid: { color: 'rgba(255, 255, 255, 0.05)' },
                            ticks: { color: '#9ca3af', font: { family: 'JetBrains Mono', size: 10 } }
                        },
                        y: {
                            grid: { color: 'rgba(255, 255, 255, 0.05)' },
                            ticks: { color: '#9ca3af', font: { family: 'JetBrains Mono', size: 10 } }
                        }
                    }
                }
            });

            // 2. Initialize Leaflet Interactive GIS Map
            // Center coordinates around sample catchment area (e.g. 20.5937, 78.9629)
            const map = L.map('gis-map').setView([20.5937, 78.9629], 11);

            // Dark map tiles from CartoDB
            L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
                attribution: '&copy; OpenStreetMap &copy; CARTO',
                subdomains: 'abcd',
                maxZoom: 19
            }).addTo(map);

            // Simulated Flood Risk GeoJSON Polygon
            const floodPolygonCoords = [
                [20.63, 78.92],
                [20.65, 78.98],
                [20.60, 79.01],
                [20.57, 78.95]
            ];

            let polygonLayer = L.polygon(floodPolygonCoords, {
                color: '#ef4444',
                fillColor: '#f87171',
                fillOpacity: 0.35,
                weight: 2
            }).addTo(map);

            polygonLayer.bindPopup("<b>Catchment Zone #04</b><br>Predicted Risk: 0.84 (Severe Inundation)<br>Forecast Peak: 210 m³/s");

            // Gauge Station Markers
            const stationMarker = L.circleMarker([20.5937, 78.9629], {
                radius: 8,
                fillColor: '#06b6d4',
                color: '#ffffff',
                weight: 2,
                opacity: 1,
                fillOpacity: 0.9
            }).addTo(map);

            stationMarker.bindPopup("<b>Gauge Station HYD-4092</b><br>Water Level: 4.2m<br>Status: Active Ingestion");

            // SOS Interactive Simulation Handler
            let sosCount = 1;
            const sosButton = document.getElementById('btn-simulate-sos');
            const sosFeed = document.getElementById('btn-simulate-sos');
            const sosCountBadge = document.getElementById('sos-count');

            sosButton.addEventListener('click', function() {
                sosCount++;
                sosCountBadge.innerText = `${sosCount} Active Pings`;

                // Add random marker on map
                const latOffset = (Math.random() - 0.5) * 0.05;
                const lngOffset = (Math.random() - 0.5) * 0.05;
                const newLat = (20.5937 + latOffset).toFixed(4);
                const newLng = (78.9629 + lngOffset).toFixed(4);

                const newMarker = L.circleMarker([newLat, newLng], {
                    radius: 7,
                    fillColor: '#ef4444',
                    color: '#ffffff',
                    weight: 2,
                    fillOpacity: 1
                }).addTo(map);

                newMarker.bindPopup(`<b>#SOS-${Math.floor(1000 + Math.random() * 9000)}</b><br>Citizen Distress Ping<br>Lat: ${newLat}, Lng: ${newLng}`).openPopup();

                // Append item to feed
                const feedContainer = document.getElementById('sos-feed');
                const newEntry = document.createElement('div');
                newEntry.className = "p-2.5 rounded-xl bg-slate-900 border border-red-500/30 flex items-start justify-between animate-pulse";
                newEntry.innerHTML = `
                    <div>
                        <span class="text-red-400 font-bold block">#SOS-${Math.floor(1000 + Math.random() * 9000)} • Evacuation Needed</span>
                        <span class="text-[10px] text-gray-400">Lat: ${newLat}, Lng: ${newLng} • Status: Queued</span>
                    </div>
                    <span class="text-[10px] bg-red-500 text-white px-2 py-0.5 rounded">NEW</span>
                `;
                feedContainer.prepend(newEntry);
            });

            // Toggle Polygon Layer Handler
            let polygonVisible = true;
            document.getElementById('btn-toggle-risk').addEventListener('click', function() {
                if (polygonVisible) {
                    map.removeLayer(polygonLayer);
                    polygonVisible = false;
                } else {
                    polygonLayer.addTo(map);
                    polygonVisible = true;
                }
            });
        };
