# ⚡ GridFlex VPP

> **Smarter Energy. Maximized Returns.**

**GridFlex VPP** is an interactive **Virtual Power Plant (VPP)** simulation dashboard. It demonstrates how intelligent Battery Energy Storage Systems (BESS) can optimize energy usage, reduce grid costs, and integrate renewable sources like solar power through algorithmic control.

![Project Status](https://img.shields.io/badge/Status-Active-success)
![Tech Stack](https://img.shields.io/badge/Stack-React_|_Vite_|_Tailwind-blue)


## 🚀 Live Demo

**[
gridflex-gamma.vercel.app]**

---

## 🌟 Key Features

* **Algorithmic Simulation:** Simulates real-time 24-hour energy usage patterns with and without battery storage.
* **Energy Arbitrage:** Demonstrates "Buy Low, Sell High" strategies by charging during off-peak hours and discharging during price spikes.
* **Peak Shaving:** Automatically flattens demand spikes to avoid expensive grid penalties.
* **Solar Integration:** Visualizes how excess solar energy is stored during the day for night-time use.
* **Financial Analytics:** Real-time calculation of ROI, total savings, and cost comparisons.
* **PDF Reporting:** Generates professional, downloadable performance reports using `jsPDF` and `html2canvas`.

## 🛠️ Tech Stack

* **Frontend:** React.js (Vite)
* **Styling:** Tailwind CSS
* **Data Visualization:** Recharts
* **Icons:** Lucide React
* **Reporting:** jsPDF, AutoTable, html2canvas

## 📊 Core Concepts

The simulation focuses on two primary energy management strategies:

1.  **Energy Arbitrage**
    * *Concept:* Capitalizing on Time-of-Use (ToU) tariffs.
    * *Action:* The system charges the battery when electricity is cheap (e.g., 2 AM) and discharges it when electricity is expensive (e.g., 6 PM).

2.  **Peak Shaving**
    * *Concept:* Reducing the maximum power draw from the grid.
    * *Action:* When facility demand spikes, the battery discharges to keep the grid import below a set threshold, reducing demand charges.

## 💻 Installation & Setup

1.  **Clone the repository**
    ```bash
    git clone [https://github.com/UTshresth/GridFlex-Optimize.-Store.-Save.git](https://github.com/UTshresth/GridFlex-Optimize.-Store.-Save.git)
    cd GridFlex-Optimize.-Store.-Save
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Run the development server**
    ```bash
    npm run dev
    ```

4.  **Build for production**
    ```bash
    npm run build
    ```

---

<div align="center">
  <p>Designed & Developed by <strong>Utsav Shresth</strong></p>
  <p>Built with ❤️ for Energy Innovation.</p>
</div>
