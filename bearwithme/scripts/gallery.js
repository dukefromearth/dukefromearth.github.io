let info = {
    frontEnd: {
        tools: "pixi.js",
        author: "Qiuyi Wu"
    },
    backend: {
        tools: "mongodb",
        author: "Stephen Duke"
    },
    robotics: {
        tools: "raspi",
        author: "Stephen Duke"
    }
}



function swapInfo(section) {
    let toolDiv = document.getElementById("tools");
    toolDiv.innerHTML = info[section].tools;
}

swapInfo('frontEnd');