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
    templateId: 'minimal',
    personalInfo: {
        fullName: '',
        email: '',
        phone: '',
        address: '',
        website: '',
        photo: null,
        showQrCode: false,
        summary: '',
    },
    experience: [],
    education: [],
    skills: [],
});

export const getSampleCV = () => ({
    id: crypto.randomUUID(),
    templateId: 'minimal',
    personalInfo: {
        fullName: 'Juan Pérez',
        email: 'juan.perez@ejemplo.com',
        phone: '+34 612 345 678',
        address: 'Barcelona, España',
        website: 'https://github.com/juanperez',
        photo: null,
        showQrCode: true,
        summary: 'Desarrollador Full Stack con más de 5 años de experiencia en la creación de aplicaciones web escalables y eficientes. Apasionado por el código limpio, arquitecturas modernas y UI minimalistas.',
    },
    experience: [
        {
            id: crypto.randomUUID(),
            company: 'Tech Solutions Inc.',
            position: 'Desarrollador Web Senior',
            startDate: 'Ene 2021',
            endDate: 'Presente',
            description: 'Lideré el desarrollo del frontend usando <mark>React</mark> y <span style="color:#ea580c">Node.js</span>. Mejoré el rendimiento de renderizado en un 40% implementando técnicas avanzadas de paginación.'
        },
        {
            id: crypto.randomUUID(),
            company: 'Agencia Creativa Digital',
            position: 'Desarrollador Frontend',
            startDate: 'Mar 2018',
            endDate: 'Dic 2020',
            description: 'Creación de interfaces de usuario atractivas. Integración con APIs REST. Trabajo bajo metodologías ágiles (Scrum).'
        }
    ],
    education: [
        {
            id: crypto.randomUUID(),
            institution: 'Universidad Politécnica de Madrid',
            degree: 'Grado en Ingeniería Informática',
            year: '2014 - 2018'
        }
    ],
    skills: [
        { id: crypto.randomUUID(), name: 'JavaScript' },
        { id: crypto.randomUUID(), name: 'React' },
        { id: crypto.randomUUID(), name: 'Node.js' },
        { id: crypto.randomUUID(), name: 'CSS/SASS' },
        { id: crypto.randomUUID(), name: 'UI/UX Design' },
    ],
});
