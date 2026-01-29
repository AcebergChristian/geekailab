import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useTheme } from "@/hooks/useTheme";

const Home: React.FC = () => {
    const {
        isDark
    } = useTheme();

    return (
        <div
            className={`min-h-screen flex flex-col transition-colors duration-300 ${isDark ? "bg-gradient-to-br from-gray-900 to-purple-950 text-white" : "bg-gradient-to-br from-white to-green-50 text-gray-900"}`}>
            {}
            <div className="absolute inset-0 z-0 overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full opacity-10">
                    {isDark ? <>
                        <div
                            className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-purple-500 filter blur-3xl"></div>
                        <div
                            className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full bg-indigo-500 filter blur-3xl"></div>
                    </> : <>
                        <div
                            className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-emerald-400 filter blur-3xl"></div>
                        <div
                            className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full bg-teal-400 filter blur-3xl"></div>
                    </>}
                </div>
                {}
                <div className="absolute inset-0 opacity-10">
                    <div
                        className={`h-full w-full grid grid-cols-12 gap-4 ${isDark ? "bg-grid-pattern-dark" : "bg-grid-pattern-light"}`}></div>
                </div>
            </div>
            <div
                className="flex-grow flex flex-col items-center justify-center p-4 relative z-10">
                <motion.div
                    initial={{
                        opacity: 0,
                        y: -20
                    }}
                    animate={{
                        opacity: 1,
                        y: 0
                    }}
                    transition={{
                        duration: 0.5
                    }}
                    className="text-center max-w-3xl">
                    <motion.div
                        initial={{
                            opacity: 0
                        }}
                        animate={{
                            opacity: 1
                        }}
                        className={`text-2xl font-bold mb-6 inline-flex items-center ${isDark ? "text-purple-400" : "text-emerald-600"}`}>
                        <div
                            className={`h-10 w-10 rounded-full flex items-center justify-center mr-3 ${isDark ? "bg-gradient-to-r from-purple-500 to-indigo-600" : "bg-gradient-to-r from-emerald-500 to-teal-600"}`}>
                            <span className="font-bold">AI</span>
                        </div>
                        <span>Mail AI Rates</span>
                    </motion.div>
                    <h1
                        className={`text-4xl md:text-6xl font-bold mb-6 ${isDark ? "bg-clip-text text-transparent bg-gradient-to-r from-white to-purple-300" : "bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-emerald-800"}`}>欢迎使用AI Rates</h1>
                    <p className={`text-xl mb-10 ${isDark ? "text-gray-300" : "text-gray-700"}`}>航运商务的好帮手</p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <motion.div
                            whileHover={{
                                scale: 1.05
                            }}
                            whileTap={{
                                scale: 0.98
                            }}>
                            <Link
                                to="/email-freight-parser"
                                className={`inline-block font-semibold py-3 px-8 rounded-md text-lg transition-colors ${isDark ? "bg-purple-500 hover:bg-purple-600 text-white" : "bg-emerald-500 hover:bg-emerald-600 text-white"}`}>AI邮件运价解析系统
                                                                              </Link>
                        </motion.div>
                        <motion.div
                            whileHover={{
                                scale: 1.05
                            }}
                            whileTap={{
                                scale: 0.98
                            }}>
                            <></>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
            <footer
                className={`py-8 text-center border-t w-full relative z-10 ${isDark ? "border-gray-800" : "border-gray-200"}`}>
                <p className={isDark ? "text-gray-400" : "text-gray-600"}>© {new Date().getFullYear()}AI产品展示平台. 保留所有权利。
                                                </p>
            </footer>
        </div>
    );
};

export default Home;