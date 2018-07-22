<?php include "header.php"; ?>

<div class="header__wrapper">
    <div class="container">
        <?php include_once "menu-inner-page.php" ?>
    </div>
</div>

    <div class="content">
        <div class="container bottom-gap">
            <ul class="breadcrumbs">
                <li><a href="/">Главная</a></li><li><a href="/about.php">О санатории</a></li><li>Нас поздравляют</li>
            </ul>

            <h1>Нас поздравляют</h1>
            <div class="certificates" id="certificates">
                <a href="http://via.placeholder.com/800x1200" class="certificate">
                    <img src="http://via.placeholder.com/200x300" title="Поздравление 1">
                    <span class="certificate__title">Поздравление 1</span>
                </a>
                <a href="http://via.placeholder.com/800x1200" class="certificate">
                    <img src="http://via.placeholder.com/200x300">
                    <span class="certificate__title">Поздравление 2</span>
                </a>
                <a href="http://via.placeholder.com/800x1200" class="certificate">
                    <img src="http://via.placeholder.com/200x300">
                    <span class="certificate__title">Поздравление 3</span>
                </a>
            </div>
        </div>
    </div>

<?php include "footer.php";