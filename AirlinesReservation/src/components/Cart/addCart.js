export const addCart = (flight) => {
    let currentTickets = JSON.parse(sessionStorage.getItem('tickets')) || [];
    if (currentTickets.length > 0) {
        let isExist = false;
        currentTickets.forEach((item) => {
            if (item.details.id === flight.details.id) {
                isExist = true;
                item.details.quantity += 1;
            }
        });
        if (!isExist) {
            flight.details.quantity = 1;
            currentTickets.push(flight);
        }
    } else {
        flight.details.quantity = 1;
        currentTickets.push(flight);
    }
    sessionStorage.setItem('tickets', JSON.stringify(currentTickets));
    alert('Flight added to cart successfully!');
};