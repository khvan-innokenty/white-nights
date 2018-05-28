<?php include "header.php"; ?>

<div class="header__wrapper">
    <div class="container">
        <?php include_once "menu-inner-page.php" ?>
    </div>
</div>

    <div class="content">
        <div class="container top-gap bottom-gap">
            <ul class="breadcrumbs">
                <li><a href="/">Главная</a></li><li>Контакты</li>
            </ul>
            <h1>Контакты</h1>

            <div class="contacts">

                <div class="contacts__left">
                    <div class="contacts__map" id="map" data-coords="60.119504, 29.951720" data-zoom="12"></div>
                    <script src="https://api-maps.yandex.ru/2.1/?lang=ru_RU" type="text/javascript" data-skip-moving="true"></script>
                </div>

                <div class="contacts__right contacts__right--primary">

                    <div class="contacts-card__wrapper">

                        <div class="contacts-card">

                            <div class="contacts-card__row">
                                <label class="contacts-card__label">Телефоны:</label>
                                <div class="contacts-card__value">
                                    <a class="white" href="tel:78614133322">+7 86141 333-22</a><br>
                                    <a href="tel:" class="white"></a>
                                </div>
                            </div>

                            <div class="contacts-card__row">
                                <label class="contacts-card__label">Адрес:</label>
                                <div class="contacts-card__value">
                                    г. Геленджик,,
                                    ул. Луначарского 178б						<p class="show-on-mobile">
                                        <a href="geo:44.580572, 38.067449?q=44.580572, 38.067449" class="button button--secondary">Открыть на карте</a>
                                    </p>
                                </div>
                            </div>

                            <div class="contacts-card__row">
                                <label class="contacts-card__label">Email:</label>
                                <div class="contacts-card__value">
                                    <a href="mailto:info23@sogaz-clinic.ru" class="white">info23@sogaz-clinic.ru</a>
                                </div>
                            </div>

                        </div>

                    </div>

                </div>

            </div>

            <div class="contacts">

                <div class="contacts__left">

                    <h2>Режим работы</h2>

                    <b>Амбулаторно-поликлиническое отделение:</b><br id="null">
                    с 8.00 до 21.00 без выходных. <br id="null">
                    <br id="null">
                    <b>Прием врачей:</b><br id="null">
                    Понедельник – суббота: с 8.00 до 21.00 часа.<br id="null">
                    <span style="color: #ff0000;">Воскресенье с 8.00.до 15.00 часов.</span>
                </div>

                <div class="contacts__right">

                    <h2>Задать вопрос</h2>

                    <form class="js-form" action="/bitrix/templates/sogaz/ajax/question.php" data-success="Ваше сообщение получено. Мы скоро свяжемся с Вами." id="contact-form">
                        <input type="text" name="name" placeholder="Ф.И.О.">
                        <div class="contacts-form">
                            <div class="contacts-form__item"><input type="tel" name="phone" placeholder="Телефон"></div>
                            <div class="contacts-form__item"><input type="email" name="email" placeholder="Email"></div>
                        </div>
                        <textarea name="message" placeholder="Сообщение" rows="4"></textarea>
                        <input type="checkbox" class="appointment__checkbox" name="legal" id="legal-contact" value="1">
                        <label for="legal-contact" class="appointment__checkbox__label">Я даю согласие на обработку персональных данных, с условиями <a href="/legal/" target="_blank">Политики обработки и защиты персональных данных</a> ознакомлен.</label>
                        <input type="hidden" name="AJAX_CONTACTS_QUESTION" value="Y">
                        <button class="button appointment__submit" type="submit" disabled><span class="text">Отправить</span></button>
                    </form>
                </div>

            </div>

        </div>
    </div>

<?php include "footer.php";