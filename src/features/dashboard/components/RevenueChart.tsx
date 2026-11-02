import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

// Example data for the demo
const data = [
  { name: 'Jan', incomes: 4000, patients: 240 },
  { name: 'Feb', incomes: 3000, patients: 139 },
  { name: 'Mar', incomes: 5000, patients: 380 },
  { name: 'Apr', incomes: 4500, patients: 390 },
  { name: 'May', incomes: 6000, patients: 480 },
  { name: 'Jun', incomes: 7200, patients: 380 },
  { name: 'Jul', incomes: 8500, patients: 430 },
];

// Custom tooltip to maintain the Tailwind aesthetic
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-slate-800 p-4 border border-slate-100 rounded-xl shadow-lg">
        <p className="text-slate-900 dark:text-slate-100 font-semibold mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2 text-sm mt-1">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-slate-500 capitalize">{entry.name}:</span>
            <span className="text-slate-900 dark:text-slate-100 font-medium">
              {entry.name === 'incomes' ? `$${entry.value}` : entry.value}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function RevenueChart() {
  return (
    <div className="w-full h-full min-h-[350px] flex flex-col">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Revenue vs Patients</h3>
          <p className="text-sm text-slate-500">Performance of the last 7 months</p>
        </div>
        <select className="bg-slate-50 border-none text-sm text-slate-700 py-2 px-4 rounded-lg focus:ring-2 focus:ring-primary-100 outline-none cursor-pointer">
          <option>Current Year</option>
          <option>Last 6 months</option>
        </select>
      </div>

      <div className="w-full mt-2">
        <ResponsiveContainer width="100%" height={350}>
          <AreaChart
            data={data}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            {/* gradient definitions for a modenr look */}
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorPatients" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
              </linearGradient>
            </defs>
            
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#94a3b8', fontSize: 12 }}
              dy={10}
            />
            
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#94a3b8', fontSize: 12 }}
              tickFormatter={(value) => `$${value}`}
            />
            
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#e2e8f0', strokeWidth: 1, strokeDasharray: '4 4' }} />
            
            <Area 
              type="monotone" 
              dataKey="patients" 
              stroke="#6366f1" 
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#colorPatients)" 
            />
            
            <Area 
              type="monotone" 
              dataKey="income" 
              stroke="#0ea5e9" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorRevenue)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}