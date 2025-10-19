import React from 'react';
import { Link } from 'react-router-dom';

const FinalSubmitPage = () => {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
            <h1 className="text-3xl font-bold">Final Submission</h1>
            <p className="text-text-secondary mt-2">This is a placeholder page for the final project submission.</p>
            <p className="text-text-secondary mt-1">This feature is not yet implemented.</p>

            <Link to="/submit" className="mt-6 inline-block bg-primary hover:bg-primary-hover text-white font-bold py-3 px-8 rounded-lg">
                Back to Participant Studio
            </Link>
        </div>
    );
};

export default FinalSubmitPage;
