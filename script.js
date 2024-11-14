$(document).ready(function () {
    const menus = [
        { name: "唐揚げ", img: "1.karaage.jpeg" },
        { name: "ブリの照り焼き", img: "2.Buriteri.jpeg" },
        { name: "グラタン", img: "3.Gratan.jpeg" },
        { name: "春巻き", img: "4.Harumaki.jpeg" },
        { name: "豚の生姜焼き", img: "5.Porksyoga.jpeg" },
        { name: "焼き魚", img: "6.Yakizakana.jpeg" },
        { name: "チップご飯", img: "7.Turkeyrice.jpeg" },
        { name: "刺身＆いくら", img: "8.Sasimi&ikura.jpeg" },
        { name: "ルーロー飯", img: "9.rurofan.jpeg" },
        { name: "鍋", img: "10.nabe.jpeg" },
        { name: "魚フライ", img: "11.friedfish.jpeg" },
        { name: "餃子", img: "12.Gyoza.jpeg" },
        { name: "UBER EATS!!!", img: "13.UberEats1.png" },
        { name: "カレー", img: "14.curry.jpeg" },
        { name: "鍋", img: "15.nabe.jpeg" },
    ];

    // これでインデックスを記録//
    let usedMenus = [];

    // 日付をYY/MM/DD形式で取得する関数//
    function getCurrentDate() {
        const date = new Date();
        return `${date.getFullYear().toString().slice(-2)}/${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}`;
    }

    $("#generate").click(function () {
        if (usedMenus.length === menus.length) {
            // 全てのメニューを使い切った場合、リセット//
            usedMenus = [];
        }
        //ランダムにメニューを決定//
        let randomIndex;

        do {
            randomIndex = Math.floor(Math.random() * menus.length);
        } while (usedMenus.includes(randomIndex));

        usedMenus.push(randomIndex);
        const selectedMenu = menus[randomIndex].name;
        const selectedImg = menus[randomIndex].img;
        const formattedDate = getCurrentDate();

        // メニューと日付を表示//
        $("#menu").text(selectedMenu);
        $("#menu-image").attr("src", `img/${selectedImg}`);

        // 履歴をローカルストレージから取得（履歴が無ければ空の配列）、こちらが上//
        let history = localStorage.getItem("menuHistory");
        if (!history) {
            history = "";
        }

        // 今までの履歴に加え、新しい履歴を追加//
        const newHistoryEntry = `${formattedDate} - ${selectedMenu} - ${randomIndex + 1}`;
        history += history ? `\n${newHistoryEntry}` : newHistoryEntry;

        // 履歴をローカルストレージに保存//
        localStorage.setItem("menuHistory", history);

        // 履歴をHTMLに追加（テーブルに表示）//
        const row = `<tr><td>${formattedDate}</td><td>${selectedMenu}</td><td>${randomIndex + 1}</td></tr>`;
        $("#history tbody").append(row);
    });

    // ページ読み込み時にローカルストレージから履歴を読み込み、表示（チャッティーで追加）//
    //split（｀split（｀
    const savedHistory = localStorage.getItem("menuHistory");
    if (savedHistory) {
        const historyEntries = savedHistory.split('\n');
        historyEntries.forEach(entry => {
            const [date, menu, menuNumber] = entry.split(' - ');
            const row = `<tr><td>${date}</td><td>${menu}</td><td>${menuNumber}</td></tr>`;
            $("#history tbody").append(row);
        });
    }

    // 履歴をクリアするボタンのクリックイベント
    $("#clear-history").click(function () {
        // ローカルストレージをクリア
        localStorage.removeItem("menuHistory");

        // テーブルをリセット（履歴表示を消去）
        $("#history tbody").empty();
        alert("履歴をクリアしました！");
    });
});

// 自分で献立を手動で追加//
$("#manual-entry-form").submit(function (event) {
    event.preventDefault();

    // 入力された日付//
    const manualDate = $("#manual-date").val();  
    // 入力された献立名//
    const manualMenu = $("#manual-menu").val();  

    if (manualDate && manualMenu) {
        // 履歴に追加するHTMLコード//
        const row = `<tr>
                        <td>${manualDate}</td>
                        <td>${manualMenu}</td>
                        <td>手動</td>
                    </tr>`;
        $("#history tbody").append(row);

        // フォームと日付フィールドをリセット//
        $("#manual-date").val(""); 
        // 献立名フィールドをリセット//
        $("#manual-menu").val("");  
    } else {
        alert("日付と献立名を全て入力してください");
    }
});

// 新しいメニューを追加//
$("#add-menu-form").submit(function (event) {
    event.preventDefault();
    const newMenuName = $("#new-menu-name").val();
    const newMenuImg = $("#new-menu-img").val();

    // メニューを追加//
    menus.push({ name: newMenuName, img: newMenuImg });

    // フォームをリセット//
    $("#new-menu-name").val("");
    $("#new-menu-img").val("");
});


$(document).ready(function () {
    // レビューを投稿する//
    $("#review-form").submit(function (event) {
        event.preventDefault();

        // フォームの入力内容を取得
        const initial = $("#review-initial").val();
        const rating = parseFloat($("#review-rating").val());
        const comment = $("#review-comment").val();

        if (initial && rating && comment) {
            // レビューを表示（★形式に変換）
            const starRating = generateStarRating(rating);

            const reviewHTML = `
                <div class="review">
                    <p class="initial">${initial}</p>
                    <p class="rating">${starRating} (${rating.toFixed(1)}点)</p>
                    <p class="comment">${comment}</p>
                </div>
            `;

            // レビューリストに追加
            $("#review-list").prepend(reviewHTML);

            //ローカルストレージにレビューを保存
            saveReviewToLocalStorage(initial, rating, comment);

            // フォームをリセット
            $("#review-initial").val("");
            $("#review-rating").val("1");
            $("#review-comment").val("");
        } else {
            alert("イニシャル、評価、コメントを全て入力してください。");
        }
        });

    // 星印（★）の生成（完全・半分・空白）
    function generateStarRating(rating) {
        const fullStars = Math.floor(rating); // 完全な星の数
        const halfStar = (rating % 1 >= 0.5) ? 1 : 0; // 半分の星の有無
        const emptyStars = 5 - fullStars - halfStar; // 空の星の数

        let stars = "";

        // 完全な星
        for (let i = 0; i < fullStars; i++) {
            stars += '<span class="star full">★</span>';
        }

        // 半分の星
        if (halfStar) {
            stars += '<span class="star half">★</span>';
        }

        // 空の星
        for (let i = 0; i < emptyStars; i++) {
            stars += '<span class="star empty">★</span>';
        }

        return stars;
    }

    //ローカルストレージにレビューを保存//
    function saveReviewToLocalStorage(initial, rating, comment) {
        let reviews = localStorage.getItem("reviews");

        //もしれびゅーが未保存なら、新しい配列として初期化
        if (!reviews) {
            reviews = "";
        }
        
        //新しいレビュー投稿欄を作成//
        const newReviews = `${initial} - ${rating} - ${comment}`;

        //既存のレビューがあれば、新レビューを追加
        reviews += reviews ? `\n${newReviews}` : newReviews;
        
        //ローカルストレージに保存//
        localStorage.setItem("reviews", reviews);
    }

    // ページ読み込み時にローカルストレージからレビューを読み込む
    function loadReviewsFromLocalStorage() {
        const reviews = localStorage.getItem("reviews");

        if (reviews) {
            const reviewEntries = reviews.split("\n");
            reviewEntries.forEach(entry => {
                const [initial, rating, comment] = entry.split(" - ");
                const starRating = generateStarRating(parseFloat(rating));

                const reviewHTML = `
                    <div class="review">
                        <p class="initial">${initial}</p>
                        <p class="rating">${starRating} (${parseFloat(rating).toFixed(1)}点)</p>
                        <p class="comment">${comment}</p>
                    </div>
                `;

                // 既存のレビューの前に追加
                $("#review-list").prepend(reviewHTML);
            });
        }
    }

    // ページが読み込まれた時にローカルストレージからレビューを読み込む
    loadReviewsFromLocalStorage();
});
