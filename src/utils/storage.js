export const STORAGE_KEY = 'cv_creator_data';

export const getSavedCVs = () => {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
};

export const saveCV = (cv) => {
    const cvs = getSavedCVs();
    const index = cvs.findIndex((item) => item.id === cv.id);
    if (index >= 0) {
        cvs[index] = cv;
    } else {
        cvs.push(cv);
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cvs));
};

export const deleteCV = (id) => {
    const cvs = getSavedCVs();
    const newCvs = cvs.filter((item) => item.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newCvs));
};

export const getDefaultCV = () => ({
    id: crypto.randomUUID(),
    personalInfo: {
        fullName: '',
        email: '',
        phone: '',
        address: '',
        summary: '',
    },
    experience: [],
    education: [],
    skills: [],
});
