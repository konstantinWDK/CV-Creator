import React from 'react';
import MinimalTemplate from './templates/MinimalTemplate';
import ModernTemplate from './templates/ModernTemplate';
import MinimalPlusTemplate from './templates/MinimalPlusTemplate';
import ProfessionalTemplate from './templates/ProfessionalTemplate';
import ClassicTemplate from './templates/ClassicTemplate';

const CVPreview = ({ data }) => {
    // Determine which template to render based on user selection
    const content = (() => {
        switch (data.templateId) {
            case 'modern':
                return <ModernTemplate data={data} />;
            case 'minimal-plus':
                return <MinimalPlusTemplate data={data} />;
            case 'professional':
                return <ProfessionalTemplate data={data} />;
            case 'classic':
                return <ClassicTemplate data={data} />;
            case 'minimal':
            default:
                return <MinimalTemplate data={data} />;
        }
    })();

    // Determine the padding values based on the selected setting
    const getPaddingTokens = () => {
        // Enforce zero padding for templates that don't support custom padding
        if (data.templateId === 'modern') {
            return { '--cv-padding-y': '0mm', '--cv-padding-x': '0mm' };
        }

        switch (data.paddingLevel) {
            case 'compact': // "Un poco" (Minimalist original padding)
                return { '--cv-padding-y': '3mm', '--cv-padding-x': '4mm' };
            case 'medium': // "Un poco más"
                return { '--cv-padding-y': '8mm', '--cv-padding-x': '10mm' };
            case 'normal':
            default:
                // "Normal" padding (slightly less than the original 18mm wide padding)
                return { '--cv-padding-y': '14mm', '--cv-padding-x': '14mm' };
        }
    };

    // Apply the selected font family and padding to the preview container using a style block
    // This ensures html2canvas (used for exporting PDF) correctly evaluates the variables, 
    // as it ignores inline styles on parent wrappers.
    return (
        <div style={{ display: 'flex', justifyContent: 'center', width: '100%', position: 'relative' }}>
            <style>{`
                #cv-preview-content {
                    font-family: ${data.fontFamily || 'Inter'};
                    --cv-padding-y: ${getPaddingTokens()['--cv-padding-y']};
                    --cv-padding-x: ${getPaddingTokens()['--cv-padding-x']};
                }
                
                /* Ensure nested elements inherit the typography correctly in some templates */
                #cv-preview-content h1, 
                #cv-preview-content h2, 
                #cv-preview-content h3, 
                #cv-preview-content h4, 
                #cv-preview-content h5, 
                #cv-preview-content h6, 
                #cv-preview-content p, 
                #cv-preview-content span, 
                #cv-preview-content div {
                    font-family: ${data.fontFamily || 'Inter'};
                }
            `}</style>

            {/* Visual Page Break Overlay for screen only. Ignored by html2pdf */}
            <div
                data-html2canvas-ignore="true"
                style={{
                    position: 'absolute',
                    top: 0,
                    width: '210mm', // Must match A4 preview width
                    height: '100%',
                    pointerEvents: 'none',
                    backgroundImage: 'repeating-linear-gradient(to bottom, transparent, transparent calc(297mm - 2px), #ef4444 calc(297mm - 2px), #ef4444 297mm)',
                    zIndex: 50,
                    opacity: 0.5
                }}
            />

            {content}
        </div>
    );
};

export default CVPreview;
