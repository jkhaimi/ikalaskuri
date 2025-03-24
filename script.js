document.addEventListener('DOMContentLoaded', () => {
    const hetuInput = document.getElementById('hetu');
    const errorElement = document.getElementById('error');
    const yearsElement = document.getElementById('years');
    const monthsElement = document.getElementById('months');
    const daysElement = document.getElementById('days');

    hetuInput.addEventListener('input', (e) => {
        // Tyhjennetään hetu kun sivu avataan
        errorElement.textContent = '';
        yearsElement.textContent = '-';
        monthsElement.textContent = '-';
        daysElement.textContent = '-';

        const hetu = e.target.value;
        
        // Lasketaan ikä vain jos hetu on oikean mittainen ja oikeassa muodossa
        if (hetu.length === 11) {
            if (validateHetu(hetu)) {
                const age = calculateAge(hetu);
                yearsElement.textContent = age.years;
                monthsElement.textContent = age.months;
                daysElement.textContent = age.days;
            } else {
                errorElement.textContent = 'Virheellinen henkilötunnus';
            }
        }
    });

    function validateHetu(hetu) {
        // Henkilötunnuksen muoto: PPKKVVXXXXX (regex = säännöllinen lauseke)
        const regex = /^(0[1-9]|[12]\d|3[01])(0[1-9]|1[0-2])(\d{2})[-A]\d{3}[\dA-Z]$/;
        
        if (!regex.test(hetu)) {
            return false;
        }

        // Tarkistetaan päivämäärän oikeellisuus
        const day = parseInt(hetu.substring(0, 2));
        const month = parseInt(hetu.substring(2, 4));
        const year = parseInt(hetu.substring(4, 6));
        const century = hetu.charAt(6);
    
        // Lasketaan vuosiluku
        let fullYear;
        switch (century) {
            case '-': fullYear = 1900 + year; break;
            case 'A': fullYear = 2000 + year; break;
            default: return false;
        }

        // Luodaan päivämäärä
        const date = new Date(fullYear, month - 1, day);
        return date.getDate() === day && 
               date.getMonth() === month - 1 && 
               date.getFullYear() === fullYear;
    }

    // Lasketaan käyttäjän ikä
    function calculateAge(hetu) {
        const day = parseInt(hetu.substring(0, 2));
        const month = parseInt(hetu.substring(2, 4));
        const year = parseInt(hetu.substring(4, 6));
        const century = hetu.charAt(6);
        
        // Lasketaan käyttäjän syntymävuosi
        let birthYear;
        switch (century) {
            case '-': birthYear = 1900 + year; break;
            case 'A': birthYear = 2000 + year; break;
        }

        // Luodaan syntymäpäivä
        const birthDate = new Date(birthYear, month - 1, day);
        const today = new Date();
        
        // Lasketaan ikä
        let years = today.getFullYear() - birthDate.getFullYear();
        let months = today.getMonth() - birthDate.getMonth();
        let days = today.getDate() - birthDate.getDate();

        // Korjataan negatiiviset arvot, eli jos huomenna on syntymäpäivä niin korjataan päivät ja kuukaudet
        if (days < 0) {
            months--;
            const lastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
            console.log(lastMonth);
            days += lastMonth.getDate();
        }

        if (months < 0) {
            years--;
            months += 12;
        }

        if (years < 0) {
            errorElement.textContent = 'Virheellinen vuosikymmenluku';
            years = 0;
            months = 0;
            days = 0;
        }

        return { years, months, days };
    }
});