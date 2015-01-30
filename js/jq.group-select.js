(function ($) {
    $.fn.qrupSelect = function (value) {
        this.each(function () {
            var that = $(this);

            that.opt = $.extend({
                data: [],
                elTemplate: $('#template-group-select').html(),
                slBtn: '.gs-btn-add',
                slSelect: '.qs-select',
                slRender: '.gs-render',
                slWrapper: '.qs-wrapper',
                slDisabled: 'disabled',
                slBtnRemove: '.qs-btn-remove',
                style: 'hide'
            }, value);

            that.opt.sl = 'gs';

            that.model = new function () {
                var _dataState = [];
                var _curentSelect = [];

                this.addItem = function (obj) {
                    _dataState.push({
                        _id: that.opt.sl + _dataState.length,
                        label: obj.label,
                        value: obj.value
                    });
                };

                this.setCurentSelect = function (arr) {
                    _curentSelect = arr;
                };

                this.curentOptions = function () {
                    var selectList = that.find(that.opt.slSelect);
                    var curentSelect = [];
                    for (var i = 0; i < selectList.length; i++) {
                        $(selectList[i]).find('option').filter(function (index, el) {
                            if ($(el).prop('selected'))
                                curentSelect.push($(el).attr('_id'));
                        });

                    }
                    _curentSelect = curentSelect;
                    return curentSelect;
                };

                this.getCurentSelect = function (arr) {
                    return _curentSelect;
                };

                this.isItemCurent = function (id) {
                    var result = false;
                    for (var i = 0; i < _curentSelect.length; i++) {
                        if (_curentSelect[i] == id)
                            result = true;
                    }
                    return result;
                };

                this.removeItem = function (value) {
                    var i, numItem;
                    for (i = 0; i < _dataState.length; i++) {
                        if (_dataState[i].value == value) {
                            numItem = i;
                        }
                    }
                    _dataState.splice(i, 1);

                    return i;
                };

                this.isItems = function () {
                    if (_dataState.length == _curentSelect.length){
                        that.find(that.opt.slBtn).addClass(that.opt.slDisabled);
                        
                        return false;
                    };
                    that.find(that.opt.slBtn).removeClass(that.opt.slDisabled);
                    
                    return true;
                };

                this.getAllItems = function () {
                    return _dataState;
                };
            };

            var showOption = function (el) {
                if (that.opt.style == 'disabled')
                    $(el).attr('disabled', false);
                if (that.opt.style == 'hide'){
                    $(el).show();
                    $(el).attr('disabled', false);
                }
            };

            var hideOption = function (el) {
                if (that.opt.style == 'disabled')
                    $(el).attr('disabled', true);
                if (that.opt.style == 'hide'){
                    $(el).hide();
                    $(el).attr('disabled', true);
                }
            };

            var chekOptions = function () {
                var options = that.find('option');
                that.model.curentOptions();

                for (var i = 0; i < options.length; i++) {
                    var option = $(options[i]);
                    if (option.prop('selected')) {
                        showOption(option);
                    } else {
                        if (that.model.isItemCurent(option.attr('_id'))) {
                            hideOption(option);
                        } else {
                            showOption(option);
                        }
                    }
                }
                
                that.model.isItems();
            };

            var renderOption = function (obj) {
                var obj = $.extend({
                    label: '',
                    value: '',
                    _id: ''
                }, obj);

                var el = '<option _id="' + obj._id + '" class="' + obj._id + '" value="' + obj.value + '">' + obj.label + '</option>';
                el = $(el);
                if (that.model.isItemCurent(obj._id))
                    hideOption(el);

                return el;
            };

            var createOptions = function (arrOpt) {
                var options = [];

                for (var i = 0; i < arrOpt.length; i++) {
                    options.push(renderOption(arrOpt[i]));
                }

                return options;
            };

            var createNewSelect = function () {
                if (!that.model.isItems())
                    return false;

                chekOptions();

                var template = $(that.opt.elTemplate);

                var options = createOptions(that.model.getAllItems());
                template.find(that.opt.slSelect).append(options);

                that.find(that.opt.slRender).append(template);

                chekOptions();
            };

            var removeBox = function (ev) {
                var box = $(ev.currentTarget).parents(that.opt.slWrapper);
                $(box).remove();
                chekOptions();
            };

            var initEvents = function () {
                that.on("click", that.opt.slBtn, function (ev) {
                    createNewSelect();
                });
                that.on("change", that.opt.slSelect, function (ev) {
                    chekOptions();
                });
                that.on("click", that.opt.slBtnRemove, function (ev) {
                    removeBox(ev);
                });
            };

            var init = function () {

                for (i = 0; i < that.opt.data.length; i++) {
                    that.model.addItem({
                        label: that.opt.data[i].label,
                        value: that.opt.data[i].value
                    });
                }

                initEvents();
            };

            init();
        });
    };
})(jQuery);

