<?php include "header.php"; ?>

    <div class="content">
        <div class="frontpage-hero__wrapper" style="background-image: url('/img/hero.jpg')">
            <div class="frontpage-hero">
                <div class="container">
                    <?php include_once "menu.php" ?>

                    <img src="/img/white-nights.svg?v=2" class="frontpage-hero__logo">

                    <ul class="frontpage-hero__promo">
                        <li>
                            <a href="/tour.php" class="frontpage-hero__promo__item">
                                <img src="/img/tour-1.jpg">
                                <span>Детокс</span>
                            </a>
                        </li>
                        <li>
                            <a href="/tour.php" class="frontpage-hero__promo__item">
                                <img src="/img/tour-1.jpg">
                                <span>Идеальный вес</span>
                            </a>
                        </li>
                        <li>
                            <a href="/tour.php" class="frontpage-hero__promo__item">
                                <img src="/img/tour-1.jpg">
                                <span>Детокс</span>
                            </a>
                        </li>
                        <li>
                            <a href="/tour.php" class="frontpage-hero__promo__item">
                                <img src="/img/tour-1.jpg">
                                <span>Детокс</span>
                            </a>
                        </li>
                        <li>
                            <a href="/tour.php" class="frontpage-hero__promo__item">
                                <img src="/img/tour-1.jpg">
                                <span>Детокс</span>
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>

        <div class="js-frontpage-mega-gallery fp-gallery__container"><!-- Слайдер -->
            <div class="fp-gallery__wrapper">
                <h2 class="fp-gallery__header">Санаторий</h2>
                <div class="fp-gallery cf fp-gallery--6">
                    <div class="fp-gallery__item"><a href="/tours.php" class="fp-gallery__anchor"><span class="fp-gallery__anchor__background" style="background-image: url('/img/tours.jpg')"></span><span class="gradient-overlay"></span><span class="fp-gallery__anchor__title">Путёвки</span></a></div>
                    <div class="fp-gallery__item"><a href="#" class="fp-gallery__anchor"><span class="fp-gallery__anchor__background" style="background-image: url('/img/territory.jpg')"></span><span class="gradient-overlay"></span><span class="fp-gallery__anchor__title">Территория</span></a></div>
                    <div class="fp-gallery__item"><a href="#" class="fp-gallery__anchor"><span class="fp-gallery__anchor__background" style="background-image: url('/img/dinner.jpg')"></span><span class="gradient-overlay"></span><span class="fp-gallery__anchor__title">Питание</span></a></div>
                    <div class="fp-gallery__item"><a href="#" class="fp-gallery__anchor"><span class="fp-gallery__anchor__background" style="background-image: url('/img/sport.jpg')"></span><span class="gradient-overlay"></span><span class="fp-gallery__anchor__title">Спорт</span></a></div>
                    <div class="fp-gallery__item"><a href="#" class="fp-gallery__anchor"><span class="fp-gallery__anchor__background" style="background-image: url('/img/rest.jpg')"></span><span class="gradient-overlay"></span><span class="fp-gallery__anchor__title">Отдых и развлечения</span></a></div>
                    <div class="fp-gallery__item"><a href="#" class="fp-gallery__anchor"><span class="fp-gallery__anchor__background" style="background-image: url('/img/basin.jpg')"></span><span class="gradient-overlay"></span><span class="fp-gallery__anchor__title">Бассейн</span></a></div>
                </div>
            </div>
            <div class="fp-gallery__wrapper">
                <h2 class="fp-gallery__header">Услуги</h2>
                <div class="fp-gallery cf fp-gallery--3">
                    <div class="fp-gallery__item"><a href="#" class="fp-gallery__anchor"><span class="fp-gallery__anchor__background" style="background-image: url('/img/medicine.jpg')"></span><span class="gradient-overlay"></span><span class="fp-gallery__anchor__title">Медицина</span></a></div>
                    <div class="fp-gallery__item"><a href="#" class="fp-gallery__anchor"><span class="fp-gallery__anchor__background" style="background-image: url('/img/cosmetology.jpg')"></span><span class="gradient-overlay"></span><span class="fp-gallery__anchor__title">Косметология</span></a></div>
                    <div class="fp-gallery__item"><a href="#" class="fp-gallery__anchor"><span class="fp-gallery__anchor__background" style="background-image: url('/img/spa.jpg')"></span><span class="gradient-overlay"></span><span class="fp-gallery__anchor__title">СПА</span></a></div>
                </div>
            </div>
            <div class="fp-gallery__wrapper">
                <h2 class="fp-gallery__header">Проживание</h2>
                <div class="fp-gallery cf fp-gallery--4">
                    <div class="fp-gallery__item"><a href="/room.php" class="fp-gallery__anchor"><span class="fp-gallery__anchor__background" style="background-image: url('/img/rooms-1.jpg')"></span><span class="gradient-overlay"></span><span class="fp-gallery__anchor__title">Однокомнатный одноместный «СТАНДАРТ»</span></a></div>
                    <div class="fp-gallery__item"><a href="/room.php" class="fp-gallery__anchor"><span class="fp-gallery__anchor__background" style="background-image: url('/img/rooms-2.jpg')"></span><span class="gradient-overlay"></span><span class="fp-gallery__anchor__title">Однокомнатный двухместный «СТАНДАРТ»</span></a></div>
                    <div class="fp-gallery__item"><a href="/room.php" class="fp-gallery__anchor"><span class="fp-gallery__anchor__background" style="background-image: url('/img/rooms-3.jpg')"></span><span class="gradient-overlay"></span><span class="fp-gallery__anchor__title">Двухкомнатный «ЛЮКС»</span></a></div>
                    <div class="fp-gallery__item"><a href="/room.php" class="fp-gallery__anchor"><span class="fp-gallery__anchor__background" style="background-image: url('/img/rooms-4.jpg')"></span><span class="gradient-overlay"></span><span class="fp-gallery__anchor__title">Трёхкомнатный «ЛЮКС»</span></a></div>
                </div>
            </div>
        </div><!-- Слайдер -->

        <div class="fp-gallery__mobile"><!-- Слайдер, мобильная версия -->
            <a href="/tours.php" class="fp-gallery__mobile__item" style="background-image: url('/img/tours.jpg')"><span class="title__wrapper"><span class="title">Путёвки</span></span></a>
            <a href="/rooms.php" class="fp-gallery__mobile__item" style="background-image: url('/img/rooms-1.jpg')"><span class="title__wrapper"><span class="title">Проживание</span></span></a>
            <a href="#" class="fp-gallery__mobile__item" style="background-image: url('/img/territory.jpg')"><span class="title__wrapper"><span class="title">Территория</span></span></a>
            <a href="/dinner.php" class="fp-gallery__mobile__item" style="background-image: url('/img/dinner.jpg')"><span class="title__wrapper"><span class="title">Питание</span></span></a>
            <a href="#" class="fp-gallery__mobile__item" style="background-image: url('/img/sport.jpg')"><span class="title__wrapper"><span class="title">Спорт</span></span></a>
            <a href="#" class="fp-gallery__mobile__item" style="background-image: url('/img/rest.jpg')"><span class="title__wrapper"><span class="title">Отдых и развлечения</span></span></a>
            <a href="#" class="fp-gallery__mobile__item" style="background-image: url('/img/basin.jpg')"><span class="title__wrapper"><span class="title">Бассейн</span></span></a>
            <a href="#" class="fp-gallery__mobile__item" style="background-image: url('/img/medicine.jpg')"><span class="title__wrapper"><span class="title">Медицина</span></span></a>
            <a href="#" class="fp-gallery__mobile__item" style="background-image: url('/img/cosmetology.jpg')"><span class="title__wrapper"><span class="title">Косметология</span></span></a>
            <a href="#" class="fp-gallery__mobile__item" style="background-image: url('/img/spa.jpg')"><span class="title__wrapper"><span class="title">СПА</span></span></a>
        </div><!-- Слайдер, мобильная версия -->

        <div class="frontapage-reasons__wrapper">
            <div class="frontpage-reasons__top-line">
                <div class="frontpage-reasons__bottom-line">
                    <div class="container">
                        <h2 class="frontpage-header frontpage-header--white">К нам едут, потому что:</h2>
                        <ul class="frontpage-reasons">
                            <li class="frontpage-reason">
                                <div class="frontpage-reason__cell frontpage-reason__cell--icon">
                                    <img src="/img/icons/frontpage/territory.svg">
                                </div>
                                <div class="frontpage-reason__cell">
                                    У нас огромная <a href="/territory.php">территория</a> с собственным берегом
                                </div>
                            </li>
                            <li class="frontpage-reason">
                                <div class="frontpage-reason__cell frontpage-reason__cell--icon">
                                    <img src="/img/icons/frontpage/ant-hill.svg">
                                </div>
                                <div class="frontpage-reason__cell">
                                    Наш санаторий - не муравейник, всего <a href="/rooms.php">136 номеров</a>
                                </div>
                            </li>
                            <li class="frontpage-reason">
                                <div class="frontpage-reason__cell frontpage-reason__cell--icon">
                                    <img src="/img/icons/frontpage/chink.svg">
                                </div>
                                <div class="frontpage-reason__cell">
                                    Имеем собственную скважину с <a href="/water.php">минеральной водой</a>
                                </div>
                            </li>
                            <li class="frontpage-reason">
                                <div class="frontpage-reason__cell frontpage-reason__cell--icon">
                                    <img src="/img/icons/frontpage/diet.svg">
                                </div>
                                <div class="frontpage-reason__cell">
                                    Мы разрабатываем план <a href="/diet.php">правильного питания</a> на всю жизнь
                                </div>
                            </li>
                            <li class="frontpage-reason">
                                <div class="frontpage-reason__cell frontpage-reason__cell--icon">
                                    <img src="/img/icons/frontpage/partnership.svg">
                                </div>
                                <div class="frontpage-reason__cell">
                                    Наши программы разработаны совместно с <a href="http://sogaz-clinic.ru" target="_blank">международным медицинским центром СОГАЗ</a>
                                </div>
                            </li>
                            <li class="frontpage-reason">
                                <div class="frontpage-reason__cell frontpage-reason__cell--icon">
                                    <img src="/img/icons/frontpage/programs.svg">
                                </div>
                                <div class="frontpage-reason__cell">
                                    Мы предлагаем <a href="/clay.php">лечебные глины</a>, <a href="/barotherapy.php">баротерапию</a>, <a href="/carboxtherapy.php">карбоксотерапию</a>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>

        <div class="container">
            <h2 class="frontpage-header">Подберите путёвку</h2>
            <div class="block-with-calculator cf">
                <div class="block-with-calculator__calculator js-stick">
                    <?php include_once "calculator.php"; ?>
                </div>
                <div class="block-with-calculator__content">
                    <ul class="tours-block">
                        <li>
                            <a class="tour-card" href="/tour.php">
                                <div class="tour-card__image popular" style="background-image: url('/img/tour-1.jpg')"></div>
                                <div class="tour-card__description">
                                    <span class="tour-card__title">Детокс</span>
                                </div>
                            </a>
                        </li>
                        <li>
                            <a class="tour-card" href="/tour.php">
                                <div class="tour-card__image" style="background-image: url('/img/tour-1.jpg')"></div>
                                <div class="tour-card__description">
                                    <span class="tour-card__title">Идеальный вес</span>
                                </div>
                            </a>
                        </li>
                        <li>
                            <a class="tour-card" href="/tour.php">
                                <div class="tour-card__image" style="background-image: url('/img/tour-1.jpg')"></div>
                                <div class="tour-card__description">
                                    <span class="tour-card__title">Антистресс</span>
                                </div>
                            </a>
                        </li>
                        <li>
                            <a class="tour-card" href="/tour.php">
                                <div class="tour-card__image" style="background-image: url('/img/tour-1.jpg')"></div>
                                <div class="tour-card__description">
                                    <span class="tour-card__title">Базовая путёвка</span>
                                </div>
                            </a>
                        </li>
                        <li>
                            <a class="tour-card" href="/tour.php">
                                <div class="tour-card__image popular" style="background-image: url('/img/tour-1.jpg')"></div>
                                <div class="tour-card__description">
                                    <span class="tour-card__title">Детокс</span>
                                </div>
                            </a>
                        </li>
                        <li>
                            <a class="tour-card" href="/tour.php">
                                <div class="tour-card__image" style="background-image: url('/img/tour-1.jpg')"></div>
                                <div class="tour-card__description">
                                    <span class="tour-card__title">Идеальный вес</span>
                                </div>
                            </a>
                        </li>
                        <li>
                            <a class="tour-card" href="/tour.php">
                                <div class="tour-card__image" style="background-image: url('/img/tour-1.jpg')"></div>
                                <div class="tour-card__description">
                                    <span class="tour-card__title">Антистресс</span>
                                </div>
                            </a>
                        </li>
                        <li>
                            <a class="tour-card" href="/tour.php">
                                <div class="tour-card__image" style="background-image: url('/img/tour-1.jpg')"></div>
                                <div class="tour-card__description">
                                    <span class="tour-card__title">Антистресс</span>
                                </div>
                            </a>
                        </li>
                        <li>
                            <a class="tour-card" href="/tour.php">
                                <div class="tour-card__image" style="background-image: url('/img/tour-1.jpg')"></div>
                                <div class="tour-card__description">
                                    <span class="tour-card__title">Антистресс</span>
                                </div>
                            </a>
                        </li>
                        <li>
                            <a class="tour-card" href="/tour.php">
                                <div class="tour-card__image" style="background-image: url('/img/tour-1.jpg')"></div>
                                <div class="tour-card__description">
                                    <span class="tour-card__title">Антистресс</span>
                                </div>
                            </a>
                        </li>
                        <li>
                            <a class="tour-card" href="/tour.php">
                                <div class="tour-card__image" style="background-image: url('/img/tour-1.jpg')"></div>
                                <div class="tour-card__description">
                                    <span class="tour-card__title">Антистресс</span>
                                </div>
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>

        <div class="container">
            <h2 class="frontpage-header">Новости</h2>
            <div id="news" class="grid-news cf">
                <div class="grid-news__cell grid-news__left">
                    <a href="/news/2018/5717/" class="news-block" style="background-image: url(/img/1.jpg)">
                        <div class="gradient-overlay"></div>
                        <div class="news-block__date">12 Февраля</div>
                        <div class="news-block__title"><span>Специалисты ММЦ «СОГАЗ» приняли участие в научном Конгрессе АСТАОР.</span></div>
                    </a>
                </div>
                <div class="grid-news__cell grid-news__right">
                    <a href="/news/2018/5207/" class="news-block" style="background-image: url(/upload/iblock/16e/banner-s-resepshenom.jpg)">
                        <div class="gradient-overlay"></div>
                        <div class="news-block__date">2 Февраля</div>
                        <div class="news-block__title"><span>ММЦ «СОГАЗ» и ПАО «НК «Роснефть» открыли новый  медицинский центр в Геленджике</span></div>
                    </a>
                </div>
                <div class="grid-news__cell grid-news__right">
                    <a href="/news/2018/5023/" class="news-block" style="background-image: url(/upload/iblock/6da/1.jpg)">
                        <div class="gradient-overlay"></div>
                        <div class="news-block__date">26 Января</div>
                        <div class="news-block__title"><span>«Дыша одним дыханием с Ленинградом…» - к 74-ой годовщине снятия блокады.</span></div>
                    </a>
                </div>
                <div class="grid-news__cell grid-news__right">
                    <a href="/news/2018/4911/" class="news-block" style="background-image: url(/upload/iblock/8f1/medosmotr-Zenita.jpg)">
                        <div class="gradient-overlay"></div>
                        <div class="news-block__date">18 Января</div>
                        <div class="news-block__title"><span>Специалисты ММЦ «СОГАЗ» провели медосмотр игроков ФК «Зенит».</span></div>
                    </a>
                </div>
                <div class="grid-news__cell grid-news__right">
                    <a href="/publications.php" class="news-block news-block--all">
                        <span>Все новости</span>
                    </a>
                </div>
            </div>
        </div>

        <div class="testimonials__wrapper">
            <div class="container">
                <h2 class="frontpage-header">Отзывы</h2>
                <div class="testimonials">
                    <div class="testimonials__decor__left"></div>
                    <div class="testimonials__decor__right"></div>
                    <div class="testimonials__inner js-testimonials">
                        <div class="testimonials__body">
                            <div class="testimonials__header">
                                <div class="testimonials__header__author">Калашник Виктор</div>
                                <div class="testimonials__header__source"><span>Из книги отзывов</span></div>
                            </div>
                            <div class="testimonials__text">
                                Уважаемые коллеги! Впервые отдыхаем в санатории «Белые ночи». В течение двух недель вплотную занимаемся здоровьем в рамках программы «Здоровый позвоночник». К зрелому возрасту накапливаются не только жизненный опыт, собственная точка зрения, независимость мышления, но… и определенные проблемы со здоровьем. Часть этих проблем мы решили благодаря усилиям Вашего замечательного профессионального внимательного коллектива. Спасибо! Применяемые методики проверены временем, не стареют и дают в комплексе замечательный результат. В плане пожеланий, возможно сотрудничество с остеопатами вертеброневрологами, использование массажа Шиацу. Еще раз Большое спасибо! Постарайтесь сохранить базовые кадры, которые и составляют главный успех и имя санаторию «Белые ночи»
                            </div>
                            <div class="testimonials__date">
                                17.08.2017
                            </div>
                        </div>
                        <div class="testimonials__body">
                            <div class="testimonials__header">
                                <div class="testimonials__header__author">Калашник Виктор</div>
                                <div class="testimonials__header__source"><span>Из книги отзывов</span></div>
                            </div>
                            <div class="testimonials__text">
                                Уважаемые коллеги! Впервые отдыхаем в санатории «Белые ночи». В течение двух недель вплотную занимаемся здоровьем в рамках программы «Здоровый позвоночник».
                            </div>
                            <div class="testimonials__date">
                                17.08.2017
                            </div>
                        </div>
                    </div>
                </div>

                <div class="button-block">
                    <a href="/testimonials.php" class="button">Все отзывы</a>
                </div>
            </div>
        </div>
    </div>

<?php include "footer.php";