'use strict';

// evado/web/jam/utility/I18n.js

// extend default translation category
// use: <span data-t="">Some text</span>
// use: <div title="Some text"></div>
// use: <input placeholder="Some text" type="text" />

Object.assign(Jam.I18n.defaults, {

    'Test utility': 'Тестовая утилита'
});

// define custom translation category
// use: <span data-t="custom">Any text</span>
// use: <div data-t="custom" title="Any text"></div>
// use: <input data-t="custom" placeholder="Any text" type="text"/>
// use: <div data-t-title="customTitle" title="Any title" data-t="custom">Any text</div>

Jam.I18n.custom = {

    'Any text': 'Любой текст'
};

Jam.I18n.customTitle = {

    'Any title': 'Любой заголовок'
};

// METADATA

Jam.I18n.meta = {

    'Active': 'Активно',
    'All requests': 'Все запросы',
    'Approve': 'Одобрить',
    'Approved': 'Одобрено',

    'Brief': 'Краткое описание',

    'Class': 'Класс',
    'Comment': 'Комментарий',
    'Comments': 'Комментарии',
    'Create': 'Создать',
    'Create comment': 'Создать комментарий',
    'Created at': 'Создано',
    'Creator': 'Создатель',

    'Date of birth': 'Дата рождения',
    'Description': 'Описание',
    'Document': 'Документ',
    'Documents': 'Документы',
    'Draft': 'Черновик',
    'Driver license': 'Водительские права',

    'Edit comment': 'Редактировать комментарий',
    'Environmental violation': 'Эконарушения',

    'File': 'Файл',
    'First name': 'Имя',
    'Form': 'Форма',

    'Health insurance': 'Медицинская страховка',

    'Icon': 'Иконка',

    'Last name': 'Фамилия',

    'Medical history': 'История болезни',
    'Message': 'Сообщение',

    'Name': 'Название',

    'Pistol': 'Пистолет',

    'Reason': 'Причина',
    'Reject': 'Отказать',
    'Rejected': 'Отказано',
    'Reopen': 'Переоткрыть',
    'Request': 'Запрос',
    'Request class': 'Класс запроса',
    'Requests': 'Запросы',
    'Rifle': 'Винтовка',

    'Send result by email': 'Отправить результат на электронный адрес',
    'Service': 'Услуга',
    'Shooting range': 'Стрельбище',
    'Shotgun': 'Дробовик',
    'Size': 'Размер',
    'Social number': 'Соцномер',
    'Social security number': 'Социальный номер',
    'State': 'Состояние',
    'Submit': 'Отправить',

    'Type': 'Тип',

    'Weapon': 'Оружие',
};

Jam.I18n['meta.class.request'] = {
};