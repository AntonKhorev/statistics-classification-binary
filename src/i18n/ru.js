// возможные источники терминологии:
// http://www.machinelearning.ru
// https://yandexdataschool.ru/edu-process/courses/machine-learning
// http://www.intuit.ru/studies/courses/6/6/lecture/176?page=5&keyword_content=%D1%82%D0%BE%D1%87%D0%BD%D0%BE%D1%81%D1%82%D1%8C
//	"точность (процент корректно классифицированных наблюдений)"
// http://gis-lab.info/qa/error-matrix.html
//	тоже за "точность"
i18ns.data.ru={
	// header
	'Binary classification':'Бинарная классификация',
	// models
	'Baseline method':'Базовый метод', // [?]
	'Logistic regression':'[[Логистическая регрессия]]',
	'Regression tree':'[[Дерево принятия решений|Регрессионное дерево]]',
	// input labels
	'options.code.filename':'Имя входного файла',
	'options.code.postprocess':'Код для обработки данных',
	'options.code.splitSeed':'Инициализация (seed) деления на обучающую/тестовую выборку', // http://www.machinelearning.ru/wiki/index.php?title=%D0%92%D1%8B%D0%B1%D0%BE%D1%80%D0%BA%D0%B0
	'options.code.splitRatio':'Доля обучающей выборки при делении',
	'options.code.formula':'Формула',
	'options.code.threshold':'Порог на вероятность для классификации',
	'Reset options':'Сбросить настройки',
	// code comments
	'load data':'загрузка данных',
	'postprocess data':'обработка данных',
	'build model':'построение модели',
	'in-sample probability prediction':'предсказание вероятностей на выборке',
	'in-sample class prediction':'предсказание классов на выборке',
	'in-sample accuracy':'точность (accuracy) на выборке', // aka верность, достоверность, правильность; precision тоже называют точностью
	'in-sample AUC':'[[ROC-кривая#.D0.9F.D0.BB.D0.BE.D1.89.D0.B0.D0.B4.D1.8C_.D0.BF.D0.BE.D0.B4_.D0.BA.D1.80.D0.B8.D0.B2.D0.BE.D0.B9|AUC]] на выборке',
};
