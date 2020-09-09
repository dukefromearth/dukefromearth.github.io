let skillsButton = document.getElementById("skills_button");
let reviewsButton = document.getElementById('reviews_button');
let dreamsButton = document.getElementById('dreams_button');


skillsButton.onclick = function () {
    let skills = document.getElementById('skills');
    skills.style.display = 'flex';
    let reviews = document.getElementById('reviews');
    if (reviews) reviews.style.display = 'none';
    // let dreams = document.getElementById('dreams');
    // if (dreams) dreams.style.display = 'none';
    var newDiv = skills.cloneNode(true);
    skills.parentNode.replaceChild(newDiv, skills);
}

// dreamsButton.onclick = function () {
//     console.log('hit');
//     function random(max) {
//         return Math.random() * (max - 0) + 0;
//     }

//     var c = document.createDocumentFragment();
//     for (var i = 0; i < 100; i++) {
//         console.log(i);
//         var styles = 'transform: translate3d(' + (random(500) - 250) + 'px, ' + (random(200) - 150) + 'px, 0) rotate(' + random(360) + 'deg);\
//                   background: hsla('+ random(360) + ',100%,50%,1);\
//                   animation: bang 700ms ease-out forwards;\
//                   all: initial:\
//                   opacity: 0';

//         var e = document.createElement("i");
//         e.style.cssText = styles.toString();
//         c.appendChild(e);
//     }
//     // document.body.appendChild(c);
//     dreamsButton.append(c);
// }

function removeAllChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

function createReviews(parent) {
    let counter = 0;
    let reviews = document.createElement('div');

    let logoWrapper = document.createElement('a');
    logoWrapper.href = "https://www.upwork.com/o/profiles/users/~017217808f08c50e5b/";
    let upworkLogo = document.createElement('img');
    upworkLogo.src = "../img/upwork-logo.png";
    upworkLogo.style.width = '300px';
    logoWrapper.appendChild(upworkLogo);


    reviews.append(logoWrapper);
    reviews.height = '100px';

    for (let r of upworkReviews.pageItems) {
        let review = document.createElement('div');
        let className = 'animated ';
        let animationLeft = 'slide-in-left';
        let animationRight = 'slide-in-right';
        if (counter % 2) {
            className += animationLeft;
            review.setAttribute('class', className);
            review.setAttribute('data-animation', animationLeft);
        } else {
            className += animationRight;
            review.setAttribute('class', className);
            review.setAttribute('data-animation', animationRight);
        }

        let title = document.createElement('div');
        title.setAttribute('class', 'label bold');
        title.style.textAlign = "left";

        title.textContent = r.title

        for (let i = 0; i < 5; i++) {
            let stars = document.createElement('span');
            if (i === 0) stars.style.paddingLeft = "20px"
            stars.style.color = "#e31b6d";
            stars.setAttribute('class', 'fa fa-star checked2');
            title.append(stars);
        }


        let comment = document.createElement('div');
        comment.style.textAlign = "left";
        comment.textContent = r.feedback.comment;

        review.appendChild(title);
        review.appendChild(comment);

        reviews.appendChild(review);

        counter++;
    }
    parent.append(reviews);
}

reviewsButton.onclick = function () {
    let reviews = document.getElementById('reviews');
    reviews.style.display = "flex";
    let skills = document.getElementById('skills');
    if (skills) skills.style.display = 'none';
    // let dreams = document.getElementById('dreams');
    // if (dreams) dreams.style.display = 'none';

    removeAllChildNodes(reviews);
    createReviews(reviews);

    var newDiv = reviews.cloneNode(true);
    reviews.parentNode.replaceChild(newDiv, reviews);

}


