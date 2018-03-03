<div class="footer__wrapper">
    <div class="container">
        <footer class="footer">
            <div class="footer__cell footer__logos">
                <a href="https://sogaz-clinic.ru" target="_blank"><img src="/img/sogaz-medicine.svg" class="footer__logo"></a>
                <img src="/img/white-nights.svg" class="footer__logo">
                <p>
                    <a href="/legal.php" class="white footer__policy">Политика обработки персональных данных</a>
                </p>
            </div>
            <div class="footer__cell">
                <div class="cf">
                    <ul class="footer__menu">
                        <li class="title"><a class="white" href="/about.php">О санатории</a></li>
                        <li><a class="white" href="/">Главная</a></li>
                        <li><a class="white" href="/tours.php">Путёвки</a></li>
                        <li><a class="white" href="/rooms.php">Проживание</a></li>
                        <li><a class="white" href="/testimonials.php">Отзывы</a></li>
                        <li><a class="white" href="/publications.php">Публикации</a></li>
                        <li><a class="white" href="/vacancies.php">Вакансии</a></li>
                        <li><a class="white" href="/">Справочная информация</a></li>
                        <li><a class="white" href="/contacts.php">Контакты</a></li>
                    </ul>
                    <ul class="footer__menu">
                        <li class="title"><a class="white" href="/about.php">Услуги</a></li>
                        <li><a class="white" href="/medicine.php">Медицина</a></li>
                        <li><a class="white" href="/about.php">Диетология</a></li>
                        <li><a class="white" href="/about.php">Косметология</a></li>
                        <li><a class="white" href="/about.php">СПА</a></li>
                    </ul>
                    <ul class="footer__menu">
                        <li class="title"><a class="white" href="/about.php">Инфраструктура</a></li>
                        <li><a class="white" href="/">Территория</a></li>
                        <li><a class="white" href="/dinner.php">Питание</a></li>
                        <li><a class="white" href="/about.php">Спорт</a></li>
                        <li><a class="white" href="/about.php">Отдых и развлечения</a></li>
                        <li><a class="white" href="/about.php">Бассейн</a></li>
                    </ul>
                </div>
            </div>
            <div class="footer__cell footer__social">
                <ul class="footer__contacts">
                    <li><?=CITY;?><br><?=ADDRESS;?></li>
                    <li><a class="white" href="<?=filter_phone(PHONE1);?>"><?=PHONE1;?></a></li>
                    <li><a class="white" href="<?=filter_phone(PHONE2);?>"><?=PHONE1;?></a></li>
                </ul>

                <a href="#" class="footer__social__link"><img class="footer__social__icon" src="/img/icons/social/vk.svg"></a>
                <a href="#" class="footer__social__link"><img class="footer__social__icon" src="/img/icons/social/facebook.svg"></a>
                <a href="#" class="footer__social__link"><img class="footer__social__icon" src="/img/icons/social/instagram.svg"></a>
                <a href="#appointment-popup" class="button button--secondary footer__button js-show-popup">Позвоните мне!</a>
                <button class="button button--outline button--white footer__button">Забронировать номер</button>
            </div>
        </footer>
        <div class="footer__disclaimer">О возможных противопоказаниях проконсультируйтесь со специалистом</div>
    </div>
</div>

<div class="mobile-menu js-mobile-menu" id="mobile-menu">
    <div class="container">
        <div class="mobile-menu__inner">
            <span class="mobile-menu__close js-mobile-menu-close"></span>

            <div class="mobile-menu__search">
                <form action="/search/" method="get" class="search">
                    <div class="search__input__wrapper">
                        <img class="search__input__icon" src="/img/icons/search.svg">
                        <input type="text" name="q" placeholder="Что ищем?" class="search__input">
                    </div>
                </form>
            </div>

            <div class="mobile-menu__grid cf">
                <ul class="mobile-menu__menu">
                    <li class="title"><a class="white" href="/about.php">О санатории</a></li>
                    <li><a class="white" href="/">Главная</a></li>
                    <li><a class="white" href="/tours.php">Путёвки</a></li>
                    <li><a class="white" href="/rooms.php">Проживание</a></li>
                    <li><a class="white" href="/testimonials.php">Отзывы</a></li>
                    <li><a class="white" href="/publications.php">Публикации</a></li>
                    <li><a class="white" href="/contacts.php">Контакты</a></li>
                </ul>
                <ul class="mobile-menu__menu">
                    <li class="title"><a class="white" href="/about.php">Услуги</a></li>
                    <li><a class="white" href="/medicine.php">Медицина</a></li>
                    <li><a class="white" href="/about.php">Диетология</a></li>
                    <li><a class="white" href="/about.php">Косметология</a></li>
                    <li><a class="white" href="/about.php">СПА</a></li>
                </ul>
                <ul class="mobile-menu__menu">
                    <li class="title"><a class="white" href="/about.php">Инфраструктура</a></li>
                    <li><a class="white" href="/">Территория</a></li>
                    <li><a class="white" href="/dinner.php">Питание</a></li>
                    <li><a class="white" href="/about.php">Спорт</a></li>
                    <li><a class="white" href="/about.php">Отдых и развлечения</a></li>
                    <li><a class="white" href="/about.php">Бассейн</a></li>
                </ul>
                <ul class="mobile-menu__menu">
                    <li class="button"><a href="#appointment-popup" class="button button--secondary js-show-popup">Позвоните мне!</a></li>
                    <li><a class="white" href="/">Справочная информация</a></li>
                    <li><a class="white with-icon" href="/"><img src="/img/icons/download.svg"> Прейскурант</a></li>
                </ul>
            </div>

        </div>
    </div>
</div>

<a href="tel:<?=filter_phone(PHONE1);?>" class="calling"></a>

<form class="appointment-popup mfp-hide zoom-anim-dialog js-form" id="appointment-popup" action="/ajax/appointment.php" data-success="Администратор скоро свяжется с Вами для записи на приём.">
    <h2>Заказ обратного звонка</h2>
    <input type="hidden" name="target" value="">
    <input name="name" type="text" placeholder="Ф.И.О.">
    <input name="phone" type="tel" placeholder="Телефон">
    <input type="checkbox" class="appointment__checkbox" name="legal" id="legal-popup">
    <label for="legal-popup" class="appointment__checkbox__label">Я даю согласие на обработку персональных данных, с условиями <a href="/legal.php" target="_blank">Политики обработки и защиты персональных данных</a> ознакомлен.</label>
    <button class="button appointment__submit" type="submit" disabled><span class="text">Позвоните мне!</span></button>
</form>

<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
<script src="/js/app.min.js?v=<?=VER;?>"></script>
</body>
</html>