import React from 'react';
import { useTranslation } from 'react-i18next';
import { CheckCircle2, Circle, AlertCircle } from 'lucide-react';

const CVCompletionBar = ({ data }) => {
    const { t } = useTranslation();

    const calculateCompletion = () => {
        let score = 0;
        const total = 6;
        const missing = [];

        // 1. Name
        if (data.personalInfo?.fullName?.trim()) score++;
        else missing.push(t('completion.tipName'));

        // 2. Email
        if (data.personalInfo?.email?.trim()) score++;
        else missing.push(t('completion.tipEmail'));

        // 3. Summary
        if (data.personalInfo?.summary?.trim().length > 20) score++;
        else missing.push(t('completion.tipSummary'));

        // 4. Experience
        if (data.experience?.length > 0) score++;
        else missing.push(t('completion.tipExperience'));

        // 5. Education
        if (data.education?.length > 0) score++;
        else missing.push(t('completion.tipEducation'));

        // 6. Skills
        if (data.skills?.length > 0) score++;
        else missing.push(t('completion.tipSkills'));

        const percentage = Math.round((score / total) * 100);
        return { percentage, missing };
    };

    const { percentage, missing } = calculateCompletion();

    const getStatusMessage = () => {
        if (percentage === 100) return t('completion.tipFull');
        if (missing.length > 0) return missing[0]; // Show the first missing tip
        return t('completion.tipDefault');
    };

    return (
        <div className="completion-guide-container">
            <div className="completion-header">
                <span className="completion-title">{t('completion.title')}</span>
                <span className="completion-percentage">{percentage}%</span>
            </div>

            <div className="progress-bar-wrapper">
                <div
                    className={`progress-bar-fill ${percentage === 100 ? 'complete' : ''}`}
                    style={{ width: `${percentage}%` }}
                ></div>
            </div>

            <div className="completion-tip">
                {percentage === 100 ? (
                    <CheckCircle2 size={16} className="tip-icon success" />
                ) : (
                    <AlertCircle size={16} className="tip-icon info" />
                )}
                <span className="tip-text">{getStatusMessage()}</span>
            </div>
        </div>
    );
};

export default CVCompletionBar;
