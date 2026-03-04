import PersonalInfo from './sections/PersonalInfo';
import Experience from './sections/Experience';
import Education from './sections/Education';
import Skills from './sections/Skills';

const CVForm = ({ data, onChange }) => {
    const updateSection = (section, newValue) => {
        onChange({
            ...data,
            [section]: newValue,
        });
    };

    return (
        <div className="cv-form">
            <PersonalInfo
                data={data.personalInfo}
                onChange={(val) => updateSection('personalInfo', val)}
            />
            <Experience
                data={data.experience}
                onChange={(val) => updateSection('experience', val)}
            />
            <Education
                data={data.education}
                onChange={(val) => updateSection('education', val)}
            />
            <Skills
                data={data.skills}
                onChange={(val) => updateSection('skills', val)}
            />
        </div>
    );
};

export default CVForm;
