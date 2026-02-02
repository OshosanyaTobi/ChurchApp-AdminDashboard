import { useTheme } from "@/hooks/use-theme";
import { Footer } from "@/layouts/footer";
import {
    CreditCard,
    DollarSign,
    Package,
    TrendingUp,
    Users,
} from "lucide-react";

const DashboardPage = () => {
    const { theme } = useTheme();

    return (
        <div className="flex min-h-screen flex-col gap-y-4">
            {/* MAIN CONTENT */}
            <div className="flex flex-1 flex-col gap-y-4">
                <h1 className="title">Dashboard</h1>

                {/* STATS CARDS */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    <div className="card">
                        <div className="card-header">
                            <div className="w-fit rounded-lg bg-blue-500/20 p-2 text-blue-500 dark:bg-blue-600/20 dark:text-blue-600">
                                <Package size={26} />
                            </div>
                            <p className="card-title">Total Blogs</p>
                        </div>
                        <div className="card-body bg-slate-100 dark:bg-slate-950">
                            <p className="text-3xl font-bold text-slate-900 dark:text-slate-50">
                                25,000
                            </p>
                            <span className="flex w-fit items-center gap-x-2 rounded-full border border-blue-500 px-2 py-1 font-medium text-blue-500 dark:border-blue-600 dark:text-blue-600">
                                <TrendingUp size={18} />
                                25%
                            </span>
                        </div>
                    </div>

                    <div className="card">
                        <div className="card-header">
                            <div className="rounded-lg bg-blue-500/20 p-2 text-blue-500 dark:bg-blue-600/20 dark:text-blue-600">
                                <DollarSign size={26} />
                            </div>
                            <p className="card-title">Total Events</p>
                        </div>
                        <div className="card-body bg-slate-100 dark:bg-slate-950">
                            <p className="text-3xl font-bold text-slate-900 dark:text-slate-50">
                                $16,000
                            </p>
                            <span className="flex w-fit items-center gap-x-2 rounded-full border border-blue-500 px-2 py-1 font-medium text-blue-500 dark:border-blue-600 dark:text-blue-600">
                                <TrendingUp size={18} />
                                12%
                            </span>
                        </div>
                    </div>

                    <div className="card">
                        <div className="card-header">
                            <div className="rounded-lg bg-blue-500/20 p-2 text-blue-500 dark:bg-blue-600/20 dark:text-blue-600">
                                <Users size={26} />
                            </div>
                            <p className="card-title">Total Volunteers</p>
                        </div>
                        <div className="card-body bg-slate-100 dark:bg-slate-950">
                            <p className="text-3xl font-bold text-slate-900 dark:text-slate-50">
                                15,400k
                            </p>
                            <span className="flex w-fit items-center gap-x-2 rounded-full border border-blue-500 px-2 py-1 font-medium text-blue-500 dark:border-blue-600 dark:text-blue-600">
                                <TrendingUp size={18} />
                                15%
                            </span>
                        </div>
                    </div>

                    <div className="card">
                        <div className="card-header">
                            <div className="rounded-lg bg-blue-500/20 p-2 text-blue-500 dark:bg-blue-600/20 dark:text-blue-600">
                                <CreditCard size={26} />
                            </div>
                            <p className="card-title">Videos</p>
                        </div>
                        <div className="card-body bg-slate-100 dark:bg-slate-950">
                            <p className="text-3xl font-bold text-slate-900 dark:text-slate-50">
                                12,340
                            </p>
                            <span className="flex w-fit items-center gap-x-2 rounded-full border border-blue-500 px-2 py-1 font-medium text-blue-500 dark:border-blue-600 dark:text-blue-600">
                                <TrendingUp size={18} />
                                19%
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* FOOTER — PINNED TO BOTTOM */}
            <Footer />
        </div>
    );
};

export default DashboardPage;
