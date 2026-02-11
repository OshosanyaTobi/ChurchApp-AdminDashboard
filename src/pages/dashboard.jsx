import { useTheme } from "@/hooks/use-theme";
import { Footer } from "@/layouts/footer";
import {
    CreditCard,
    DollarSign,
    Package,
    Users,
    ClipboardList,
    ShieldCheck,
} from "lucide-react";

const DashboardPage = () => {
    const { theme } = useTheme();

    return (
        <div className="flex min-h-screen flex-col gap-y-4">
            {/* MAIN CONTENT */}
            <div className="flex flex-1 flex-col gap-y-4">
                <h1 className="title">Dashboard</h1>

                {/* STATS CARDS */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    
                    {/* Total Blogs */}
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
                        </div>
                    </div>

                    {/* Total Events */}
                    <div className="card">
                        <div className="card-header">
                            <div className="rounded-lg bg-blue-500/20 p-2 text-blue-500 dark:bg-blue-600/20 dark:text-blue-600">
                                <DollarSign size={26} />
                            </div>
                            <p className="card-title">Total Events</p>
                        </div>
                        <div className="card-body bg-slate-100 dark:bg-slate-950">
                            <p className="text-3xl font-bold text-slate-900 dark:text-slate-50">
                                16,000
                            </p>
                        </div>
                    </div>

                    {/* Total Volunteers */}
                    <div className="card">
                        <div className="card-header">
                            <div className="rounded-lg bg-blue-500/20 p-2 text-blue-500 dark:bg-blue-600/20 dark:text-blue-600">
                                <Users size={26} />
                            </div>
                            <p className="card-title">Total Volunteers</p>
                        </div>
                        <div className="card-body bg-slate-100 dark:bg-slate-950">
                            <p className="text-3xl font-bold text-slate-900 dark:text-slate-50">
                                15,400
                            </p>
                        </div>
                    </div>

                    {/* Videos */}
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
                        </div>
                    </div>

                    {/* Total Assignments */}
                    <div className="card">
                        <div className="card-header">
                            <div className="rounded-lg bg-blue-500/20 p-2 text-blue-500 dark:bg-blue-600/20 dark:text-blue-600">
                                <ClipboardList size={26} />
                            </div>
                            <p className="card-title">Total Assignments</p>
                        </div>
                        <div className="card-body bg-slate-100 dark:bg-slate-950">
                            <p className="text-3xl font-bold text-slate-900 dark:text-slate-50">
                                320
                            </p>
                        </div>
                    </div>

                    {/* Total Roles */}
                    <div className="card">
                        <div className="card-header">
                            <div className="rounded-lg bg-blue-500/20 p-2 text-blue-500 dark:bg-blue-600/20 dark:text-blue-600">
                                <ShieldCheck size={26} />
                            </div>
                            <p className="card-title">Total Roles</p>
                        </div>
                        <div className="card-body bg-slate-100 dark:bg-slate-950">
                            <p className="text-3xl font-bold text-slate-900 dark:text-slate-50">
                                18
                            </p>
                        </div>
                    </div>

                </div>
            </div>

            {/* FOOTER */}
            <Footer />
        </div>
    );
};

export default DashboardPage;
