<header class="header">
    <div class="header__cell header__logo">
        <a href="/"><img src="/img/white-nights.svg"></a>
    </div>
    <div class="header__cell">
        <ul class="header__contacts">
            <li><?=CITY;?><br><?=ADDRESS;?></li>
            <li><a class="white" href="<?=filter_phone(PHONE1);?>"><?=PHONE1;?></a></li>
            <li><a class="white" href="<?=filter_phone(PHONE2);?>"><?=PHONE1;?></a></li>
        </ul>
    </div>
    <ul class="header__cell header__menu">
        <li><a href="/tours.php" class="white">Путёвки</a></li>
        <li><a href="/rooms.php" class="white">Проживание</a></li>
        <li><a href="/medicine.php" class="white">Медицина</a></li>
        <li>
            <button class="hamburger__button js-hamburger">
                <i class="hamburger"><i class="l1"></i><i class="l2"></i><i class="l3"></i></i>
                <span class="title-1">Меню</span>
            </button>
        </li>
    </ul>
</header>
