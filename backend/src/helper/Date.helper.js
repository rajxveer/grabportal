class LocalDatetimeHelper{
    static getCurrentDate(){
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0'); // January is 0
        const day = String(now.getDate()).padStart(2, '0');

        const formattedDate = `${year}-${month}-${day}`;
        return formattedDate;
    }

    static getStartOfThisMonthDate(){
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const startDateString = startOfMonth.toISOString().slice(0, 10); // "yyyy-MM-dd"
        return startDateString
    }
}

module.exports = LocalDatetimeHelper;