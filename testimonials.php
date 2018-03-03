<?php include "header.php"; ?>

<div class="header__wrapper">
    <div class="container">
        <?php include_once "menu-inner-page.php" ?>
    </div>
</div>

    <div class="content">
        <div class="container">
            <ul class="breadcrumbs"><li><a href="/">Главная</a></li><li>Отзывы</li></ul>

            <h1>Отзывы</h1>

            <div class="page-testimonials__add">
                <a class="button js-show-popup" href="#add-testimonial-popup">Добавить отзыв</a>

                <form class="add-testimonial-popup mfp-hide zoom-anim-dialog js-form" id="add-testimonial-popup" action="/ajax/testimonial.php" data-success="Мы получили Ваш отзыв.">
                    <h2>Добавить отзыв</h2>
                    <input type="hidden" name="target" value="">
                    <input name="name" type="text" placeholder="Ф.И.О.">
                    <input name="phone" type="tel" placeholder="Телефон (не для публикации)">
                    <textarea name="testimonial" placeholder="Отзыв"></textarea>
                    <input type="checkbox" class="appointment__checkbox" name="legal" id="legal-popup">
                    <label for="legal-popup" class="appointment__checkbox__label">Я даю согласие на обработку персональных данных, с условиями <a href="/legal.php" target="_blank">Политики обработки и защиты персональных данных</a> ознакомлен.</label>
                    <button class="button appointment__submit" type="submit" disabled><span class="text">Добавить</span></button>
                </form>
            </div>

            <div class="page-testimonials">
                <div class="page-testimonial">
                    <div class="page-testimonial__title">
                        <div class="page-testimonial__name">Александр</div>
                        <div class="page-testimonial__date">21.11.2017</div>
                    </div>
                    <div class="page-testimonial__body">
                        Большая благодарность офтальмологу Данилову Павлу Анатольевичу! Спасибо!
                    </div>
                </div>
                <div class="page-testimonial">
                    <div class="page-testimonial__title">
                        <div class="page-testimonial__name">Александр</div>
                        <div class="page-testimonial__date">21.11.2017</div>
                    </div>
                    <div class="page-testimonial__body">
                        Большая благодарность офтальмологу Данилову Павлу Анатольевичу! Спасибо!
                    </div>
                </div>
                <div class="page-testimonial">
                    <div class="page-testimonial__title">
                        <div class="page-testimonial__name">Александр</div>
                        <div class="page-testimonial__date">21.11.2017</div>
                    </div>
                    <div class="page-testimonial__body">
                        Большая благодарность офтальмологу Данилову Павлу Анатольевичу! Спасибо!
                    </div>
                </div>
            </div>
        </div>
    </div>

<?php include "footer.php";