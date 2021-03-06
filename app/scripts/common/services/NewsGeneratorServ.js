(function () {
    'use strict';

    angular.module('common')
        .factory('NewsGeneratorServ', function ($http, $q, $rootScope) {

            var gUrl = 'http://api.feedzilla.com/v1/categories.json';
            var svobodaUrls = ['zoprp_egjrpy', 'zipqpqejjqpo', 'zjkqp_eymopy', 'z_oqpvergqpr', 'zmtqte$oot', 'zooqppegkqpm']
            var allCategories = [];
            var avoidCategories = ['игорем', 'померанцев'];
            var avoidNewsWithTitle = ['стрелков'];

            function isInAvoid(tag) {
                for (var i = 0; i < avoidCategories.length; i++) {
                    var avoid = avoidCategories[i];
                    if (tag.indexOf(avoid) > -1) {
                        return true;
                    }

                }
                return false;
            }

            function getUniqueCategories(news) {
                var categories = [];
                var categNumb = [];
                news.forEach(function (n) {
                    var indCateg = n.sections;

                    indCateg.forEach(function (nin) {

                        if (!isInAvoid(nin)) {

                            if (nin.length > 0) {
                                var index = categories.indexOf(nin);
                                if (index === -1) {
                                    categories.push(nin);
                                    categNumb.push(1);
                                } else {
                                    categNumb[index]++;
                                }

                            }
                        }

                    })

                })
                //console.log(categories);
                //console.log(categNumb);
                _.zip(categories, categNumb).forEach(function (tag) {
                    allCategories.push({name: tag[0], numb: tag[1]});
                });
                allCategories = _.sortBy(allCategories, function (tag2) {
                    return -tag2.numb;
                });
                $rootScope.allCateg = allCategories;

                return allCategories;

            }

            function classify(news) {
                news.forEach(function (n) {
                    n.sections = [];
                    var indCateg = n.categories;

                    indCateg.forEach(function (nin) {
                        nin = nin.replace('Новости - ', '');
                        nin = nin.replace('Новости', '').toLowerCase();
                        if (nin.length > 0) {
                            n.sections.push(nin);

                        }

                    })

                    n.categories = null;
                })
                return news;

            }

            return {
                getCategories: function (limit) {
                    if (limit) {

                        return _.first(allCategories, limit);
                    }
                    return allCategories;
                },

                getPoliticalNews: function (number, shuffle) {
                    number = number || 20;
                    //shuffle = shuffle || true;

                    var deferred = $q.defer();
                    var urlCom = 'http://www.svoboda.org/api/';
                    var promises = [];

                    var allNewsArr = [];
                    for (var i = 0; i < svobodaUrls.length; i++) {
                        var urlEnd = svobodaUrls[i];
                        var url = urlCom + urlEnd;
                        promises.push(this.getPoliticalNewsWithImages(url).then(function (value) {
                            allNewsArr.push(value);
                        }));
                    }
                    $q.all(promises).then(function () {
                        var uniqueNews = [];
                        var uniqueImgs = [];
                        allNewsArr.forEach(function (oneNews) {
                            for (var i = 0; i < oneNews.length; i++) {
                                var singleNews = oneNews[i];
                                var titleTokens = _.map(singleNews.title.split(' '), function (token) {
                                    return token.toLowerCase();
                                });
                                var interSection = _.intersection(titleTokens, avoidNewsWithTitle);
                                if (interSection.length === 0) {
                                    var img = singleNews.img;
                                    if (uniqueImgs.indexOf(img) === -1) {
                                        uniqueImgs.push(img);
                                        uniqueNews.push(singleNews);
                                    }
                                }

                            }
                        });
                        uniqueNews = _.first(_.sortBy(uniqueNews, function (sNews) {
                            return -sNews.content.length;
                        }), number);

                        var counter = 0;
                        uniqueNews = _.map(uniqueNews, function (eNews) {
                            eNews.id = counter++;
                            return eNews;
                        });

                        if (shuffle) {
                            var t5 = _.shuffle(_.take(uniqueNews, 5));
                            var rest = _.rest(uniqueNews, 5);
                            uniqueNews = _.union(t5, rest);
                        }
                        getUniqueCategories(uniqueNews);

                        deferred.resolve(uniqueNews);
                    });

                    return deferred.promise;
                },

                getPoliticalNewsWithImages: function (url, number, shuffle) {
                    number = number || 50;
                    var deferred = $q.defer();

                    var result = $http.jsonp('//ajax.googleapis.com/ajax/services/feed/load?v=1.0&output=json_xml&num=50&callback=JSON_CALLBACK&q=' + encodeURIComponent(url));

                    function parseXml(xml) {
                        var start = 0;
                        var end = 0;
                        var imgs = [];
                        while (true) {
                            start = xml.indexOf('enclosure', start);
                            if (start === -1) {
                                break;
                            }

                            start = xml.indexOf('http', start);

                            end = xml.indexOf('"', start);
                            var img = xml.substring(start, end);
                            imgs.push(img);
                            start = end;

                        }
                        return imgs;
                    }

                    function joinNewsImages(news, imgs) {
                        for (var i = 0; i < news.length; i++) {
                            var n = news[i];
                            var img = imgs[i];
                            n.img = img;
                        }
                        return news;
                    }

                    result.then(function (data) {
                        var finalNews;
                        var xml = data.data.responseData.xmlString;
                        var imgs = parseXml(xml);
                        var news = (data.data.responseData.feed.entries);
                        news = joinNewsImages(news, imgs);
                        if (shuffle) {
                            news = _.rest(news, 3);
                            finalNews = _.first(_.shuffle(news), number);
                        } else {
                            finalNews = _.first(news, number);
                        }

                        //var categories = getUniqueCategories(finalNews);
                        finalNews = classify(finalNews);
                        //console.log(categories);

                        deferred.resolve(finalNews);
                    }).catch(function (e) {
                        deferred.reject('Error in rss request. Due to: ' + e);
                    });

                    return deferred.promise;

                }

            };
        });
})
();
