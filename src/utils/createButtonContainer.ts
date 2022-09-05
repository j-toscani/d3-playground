
export default function createButtonContainer() {
    const main = document.querySelector('main');
    if(!main) {
        return
    }
    
    const container = document.createElement('div');
    container.classList.add('button-container');
    main.append(container);

    return container;
}

