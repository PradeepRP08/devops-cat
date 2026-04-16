import React from 'react';

const SkeletonListing = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 animate-pulse">
            {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-gray-100/50 rounded-[2rem] p-8 space-y-6 border border-gray-100">
                    <div className="flex justify-between items-start">
                        <div className="w-16 h-16 bg-gray-200 rounded-2xl"></div>
                        <div className="space-y-2">
                             <div className="w-20 h-4 bg-gray-200 rounded-full"></div>
                             <div className="w-14 h-4 bg-gray-200 rounded-full"></div>
                        </div>
                    </div>
                    <div className="space-y-3">
                        <div className="w-3/4 h-6 bg-gray-200 rounded-lg"></div>
                        <div className="w-1/2 h-4 bg-gray-200 rounded-full"></div>
                    </div>
                    <div className="flex gap-2">
                        <div className="w-16 h-6 bg-gray-200 rounded-lg"></div>
                        <div className="w-16 h-6 bg-gray-200 rounded-lg"></div>
                        <div className="w-16 h-6 bg-gray-200 rounded-lg"></div>
                    </div>
                    <div className="pt-4 border-t border-gray-200 flex gap-4">
                        <div className="flex-1 h-12 bg-gray-200 rounded-xl"></div>
                        <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default SkeletonListing;
