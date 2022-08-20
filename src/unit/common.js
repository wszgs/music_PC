export function formatDate(time) { 
    let date = new Date(time);
    let year = date.getFullYear();
    let month = date.getMonth()+1;
    let day = date.getDate();
    month = month < 10 ? "0"+month:month;
    day = day < 10 ? "0"+day:day;
    date = year+'-'+month+'-'+day;
    return date

} 