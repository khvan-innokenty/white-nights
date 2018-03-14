<?php include "header.php"; ?>

<div class="header__wrapper">
    <div class="container">
        <?php include_once "menu-inner-page.php" ?>
    </div>
</div>

    <div class="content">
        <div class="container bottom-gap">
            <ul class="breadcrumbs">
                <li><a href="/">Главная</a></li><li>Поиск</li>
            </ul>

            <form action="/search.php" method="get" class="search">
                <div class="search__input__wrapper search__input__wrapper--primary">
                    <img class="search__input__icon" src="/img/icons/search-primary.svg">
                    <input type="text" name="q" placeholder="Что ищем?" class="search__input">
                </div>
                <div class="search__submit__wrapper">
                    <button type="submit" class="button search-form__submit">Найти</button>
                </div>
            </form>

            <div class="search-result">
                <a href="/services/diagnosis/ultrasound-of-the-pelvic-organs/?sphrase_id=8903" class="search-result__title"><b>УЗИ</b> органов малого таза</a>
                <p>Ультразвуковое исследование (<b>УЗИ</b>) органов малого таза является одним из наиболее информативных методов диагностики в современной гинекологии, который позволяет контролировать ... </p>
            </div>

            <div class="search-result">
                <a href="/services/diagnosis/ultrasound-of-the-pelvic-organs/?sphrase_id=8903" class="search-result__title"><b>УЗИ</b> органов малого таза</a>
                <p>Ультразвуковое исследование (<b>УЗИ</b>) органов малого таза является одним из наиболее информативных методов диагностики в современной гинекологии, который позволяет контролировать ... </p>
            </div>
        </div>
    </div>

<?php include "footer.php";