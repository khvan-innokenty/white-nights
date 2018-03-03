<?php include "header.php"; ?>

<div class="header__wrapper">
    <div class="container">
        <?php include_once "menu-inner-page.php" ?>
    </div>
</div>

    <div class="content">
        <div class="page-hero__wrapper" style="background-image: url('/img/tours.jpg')">
            <div class="page-hero">
                <div class="container">
                    <ul class="breadcrumbs">
                        <li><a href="/">Главная</a></li><li>Путёвки</li>
                    </ul>
                    <h1 class="page-hero__header">Путёвки</h1>
                    <div class="page-hero__description">
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                        <p>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                    </div>
                </div>
            </div>
        </div>

        <div class="container top-gap bottom-gap">
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
    </div>

<?php include "footer.php";