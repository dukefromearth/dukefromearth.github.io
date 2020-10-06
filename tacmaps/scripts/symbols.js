export default class Symbol {
    constructor(name, type) {
        switch (type) {
            case "button":
                this.createButton(name);
                break;
            case "h1":
                this.createText(name, 'h1');
                break;
            case "h2":
                this.createText(name, 'h2');
                break;
            case "p":
                this.createText(name, 'p');
                break;
            default:
                return;
        }
    }
    createButton(name) {
        var div = this.createDiv();
        var btn = document.createElement("BUTTON");   // Create a <button> element
        btn.innerHTML = name;                   // Insert text
        div.appendChild(btn);               // Append <button> to <body>
    }
    createText(name, type) {
        var div = this.createDiv();
        var txt = document.createElement(type);   // Create a <button> element
        txt.innerHTML = name;                   // Insert text
        div.appendChild(txt);               // Append <button> to <body>
    }
    createDiv() {
        var div = document.createElement("div");
        document.body.appendChild(div);
        return div;
    }
}