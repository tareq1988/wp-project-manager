webpackJsonp([3],{

/***/ 100:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__directive_js__ = __webpack_require__(102);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__project_new_user_form_vue__ = __webpack_require__(104);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//




var new_project_form = {

	props: ['is_update'],

	data() {

		return {
			'project_name': '',
			'project_cat': 0,
			'project_description': '',
			'project_notify': false,
			'project_users': []

		};
	},
	components: {
		'project-new-user-form': __WEBPACK_IMPORTED_MODULE_1__project_new_user_form_vue__["a" /* default */]
	},
	computed: {
		roles() {
			return this.$root.$store.state.roles;
		},

		categories() {
			return this.$root.$store.state.categories;
		},

		project() {
			if (this.is_update) {
				this.project_users = this.$root.$store.state.project_users;
				return this.$root.$store.state.project;
			}

			return {};
		},

		project_category: {
			get() {
				if (this.is_update) {
					var project = this.$root.$store.state.project;

					if (typeof project.categories !== 'undefined' && project.categories.data.length) {

						this.project_cat = project.categories.data[0].id;

						return project.categories.data[0].id;
					}
				}

				return this.project_cat;
			},

			set(cat) {
				this.project_cat = cat;
			}
		}

	},

	methods: {

		formatUsers(users) {
			var format_users = [];

			users.map(function (user, index) {
				format_users.push({
					'user_id': user.id,
					'role_id': user.roles.data.id
				});
			});

			return format_users;
		},

		deleteUser(del_user) {
			this.project_users = this.project_users.filter(function (user) {
				if (user.id === del_user.id) {
					return false;
				} else {
					return user;
				}
			});
		}
	}
};

/* harmony default export */ __webpack_exports__["a"] = (new_project_form);

/***/ }),

/***/ 101:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//


/* harmony default export */ __webpack_exports__["a"] = ({
    props: ['project_users'],

    data() {
        return {
            username: '',
            first_name: '',
            last_name: '',
            email: ''
        };
    },

    methods: {
        createUser() {
            var self = this;

            self.httpRequest({
                url: self.base_url + '/cpm/v2/users',
                method: 'POST',
                data: {
                    username: this.username,
                    first_name: this.first_name,
                    last_name: this.last_name,
                    email: this.email
                },

                success: function (res) {
                    if (!res.data.hasOwnProperty('roles')) {
                        res.data.roles = {
                            data: {
                                description: "Co-Worker for project manager",
                                id: 1,
                                title: "Co-Worker"
                            }
                        };
                    }
                    self.project_users.push(res.data);
                    jQuery("#cpm-create-user-wrap").dialog("close");
                }
            });
        }
    }
});

/***/ }),

/***/ 102:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__vue_vue__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__vue_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__vue_vue__);


var Project = {
    coWorkerSearch: function (el, binding, vnode) {

        var $ = jQuery;
        var cpm_abort;
        var context = vnode.context;

        $(".cpm-project-coworker").autocomplete({
            minLength: 3,

            source: function (request, response) {
                var data = {},
                    url = context.base_url + '/cpm/v2/users/search?query=' + request.term;

                if (cpm_abort) {
                    cpm_abort.abort();
                }

                cpm_abort = $.get(url, data, function (resp) {

                    if (resp.data.length) {
                        response(resp.data);
                    } else {
                        response({
                            value: '0'
                        });
                    }
                });
            },

            search: function () {
                $(this).addClass('cpm-spinner');
            },

            open: function () {
                var self = $(this);
                self.autocomplete('widget').css('z-index', 999999);
                self.removeClass('cpm-spinner');
                return false;
            },

            select: function (event, ui) {

                if (ui.item.value === '0') {
                    $("form.cpm-user-create-form").find('input[type=text]').val('');
                    $("#cpm-create-user-wrap").dialog("open");
                } else {

                    var has_user = context.project_users.find(function (user) {
                        return ui.item.id === user.id ? true : false;
                    });

                    if (!has_user) {
                        if (!ui.item.hasOwnProperty('roles')) {
                            ui.item.roles = {
                                data: {
                                    description: "Co-Worker for project manager",
                                    id: 1,
                                    title: "Co-Worker"
                                }
                            };
                        }
                        context.project_users.push(ui.item);
                    }

                    $('.cpm-project-role>table').append(ui.item._user_meta);
                    $("input.cpm-project-coworker").val('');
                }
                return false;
            }

        }).data("ui-autocomplete")._renderItem = function (ul, item) {
            if (item.email) {
                return $("<li>").append('<a>' + item.display_name + '</a>').appendTo(ul);
            } else {
                return $("<li>").append('<a><div class="no-user-wrap"><p>No users found.</p> <span class="button-primary">Create a new user?</span></div></a>').appendTo(ul);
            }
        };
    }

    // Register a global custom directive called v-pm-popup-box
};__WEBPACK_IMPORTED_MODULE_0__vue_vue___default.a.directive('pm-users', {
    inserted: function (el, binding, vnode) {
        Project.coWorkerSearch(el, binding, vnode);
    }
});

// Register a global custom directive called v-pm-popup-box
__WEBPACK_IMPORTED_MODULE_0__vue_vue___default.a.directive('pm-popup-box', {
    inserted: function (el) {
        jQuery(el).dialog({
            autoOpen: false,
            modal: true,
            dialogClass: 'cpm-ui-dialog',
            width: 485,
            height: 'auto',
            position: ['middle', 100]
        });
    }
});

// Register a global custom directive called v-pm-popup-box
__WEBPACK_IMPORTED_MODULE_0__vue_vue___default.a.directive('cpm-user-create-popup-box', {

    inserted: function (el) {
        jQuery(function ($) {
            $(el).dialog({
                autoOpen: false,
                modal: true,
                dialogClass: 'cpm-ui-dialog cpm-user-ui-dialog',
                width: 400,
                height: 'auto',
                position: ['middle', 100]
            });
        });
    }
});

/***/ }),

/***/ 103:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_project_create_form_vue__ = __webpack_require__(100);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_792d7af7_hasScoped_false_node_modules_vue_loader_lib_selector_type_template_index_0_project_create_form_vue__ = __webpack_require__(105);
var disposed = false
var normalizeComponent = __webpack_require__(0)
/* script */

/* template */

/* styles */
var __vue_styles__ = null
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_project_create_form_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_792d7af7_hasScoped_false_node_modules_vue_loader_lib_selector_type_template_index_0_project_create_form_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "view/assets/js/components/project-lists/project-create-form.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] project-create-form.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-792d7af7", Component.options)
  } else {
    hotAPI.reload("data-v-792d7af7", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ 104:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_project_new_user_form_vue__ = __webpack_require__(101);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_7bb6591b_hasScoped_false_node_modules_vue_loader_lib_selector_type_template_index_0_project_new_user_form_vue__ = __webpack_require__(106);
var disposed = false
var normalizeComponent = __webpack_require__(0)
/* script */

/* template */

/* styles */
var __vue_styles__ = null
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_project_new_user_form_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_7bb6591b_hasScoped_false_node_modules_vue_loader_lib_selector_type_template_index_0_project_new_user_form_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "view/assets/js/components/project-lists/project-new-user-form.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] project-new-user-form.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-7bb6591b", Component.options)
  } else {
    hotAPI.reload("data-v-7bb6591b", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ 105:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("div", [
    _c(
      "form",
      {
        staticClass: "cpm-project-form",
        attrs: { action: "", method: "post" },
        on: {
          submit: function($event) {
            $event.preventDefault()
            _vm.newProject()
          }
        }
      },
      [
        _c("div", { staticClass: "cpm-form-item project-name" }, [
          _c("input", {
            directives: [
              {
                name: "model",
                rawName: "v-model",
                value: _vm.project.title,
                expression: "project.title"
              }
            ],
            attrs: {
              type: "text",
              name: "project_name",
              id: "project_name",
              placeholder: "Name of the project",
              value: "",
              size: "45"
            },
            domProps: { value: _vm.project.title },
            on: {
              input: function($event) {
                if ($event.target.composing) {
                  return
                }
                _vm.project.title = $event.target.value
              }
            }
          })
        ]),
        _vm._v(" "),
        _c("div", { staticClass: "cpm-form-item project-category" }, [
          _c(
            "select",
            {
              directives: [
                {
                  name: "model",
                  rawName: "v-model",
                  value: _vm.project_category,
                  expression: "project_category"
                }
              ],
              staticClass: "chosen-select",
              attrs: { name: "project_cat", id: "project_cat" },
              on: {
                change: function($event) {
                  var $$selectedVal = Array.prototype.filter
                    .call($event.target.options, function(o) {
                      return o.selected
                    })
                    .map(function(o) {
                      var val = "_value" in o ? o._value : o.value
                      return val
                    })
                  _vm.project_category = $event.target.multiple
                    ? $$selectedVal
                    : $$selectedVal[0]
                }
              }
            },
            [
              _c("option", { attrs: { value: "0" } }, [
                _vm._v("– Project Category –")
              ]),
              _vm._v(" "),
              _vm._l(_vm.categories, function(category) {
                return _c("option", { domProps: { value: category.id } }, [
                  _vm._v(_vm._s(category.title))
                ])
              })
            ],
            2
          )
        ]),
        _vm._v(" "),
        _c("div", { staticClass: "cpm-form-item project-detail" }, [
          _c("textarea", {
            directives: [
              {
                name: "model",
                rawName: "v-model",
                value: _vm.project.description,
                expression: "project.description"
              }
            ],
            staticClass: "cpm-project-description",
            attrs: {
              name: "project_description",
              id: "",
              cols: "50",
              rows: "3",
              placeholder: "Some details about the project (optional)"
            },
            domProps: { value: _vm.project.description },
            on: {
              input: function($event) {
                if ($event.target.composing) {
                  return
                }
                _vm.project.description = $event.target.value
              }
            }
          })
        ]),
        _vm._v(" "),
        _c("div", { staticClass: "cpm-form-item cpm-project-role" }, [
          _c(
            "table",
            _vm._l(_vm.project_users, function(projectUser) {
              return _c("tr", [
                _c("td", [_vm._v(_vm._s(projectUser.display_name))]),
                _vm._v(" "),
                _c("td", [
                  _c(
                    "select",
                    {
                      directives: [
                        {
                          name: "model",
                          rawName: "v-model",
                          value: projectUser.roles.data.id,
                          expression: "projectUser.roles.data.id"
                        }
                      ],
                      on: {
                        change: function($event) {
                          var $$selectedVal = Array.prototype.filter
                            .call($event.target.options, function(o) {
                              return o.selected
                            })
                            .map(function(o) {
                              var val = "_value" in o ? o._value : o.value
                              return val
                            })
                          projectUser.roles.data.id = $event.target.multiple
                            ? $$selectedVal
                            : $$selectedVal[0]
                        }
                      }
                    },
                    _vm._l(_vm.roles, function(role) {
                      return _c("option", { domProps: { value: role.id } }, [
                        _vm._v(_vm._s(role.title))
                      ])
                    })
                  )
                ]),
                _vm._v(" "),
                _c("td", [
                  _c(
                    "a",
                    {
                      staticClass: "cpm-del-proj-role cpm-assign-del-user",
                      attrs: { hraf: "#" },
                      on: {
                        click: function($event) {
                          $event.preventDefault()
                          _vm.deleteUser(projectUser)
                        }
                      }
                    },
                    [
                      _c("span", { staticClass: "dashicons dashicons-trash" }),
                      _vm._v(" "),
                      _c("span", { staticClass: "title" }, [_vm._v("Delete")])
                    ]
                  )
                ])
              ])
            })
          )
        ]),
        _vm._v(" "),
        _c("div", { staticClass: "cpm-form-item project-users" }, [
          _c("input", {
            directives: [{ name: "pm-users", rawName: "v-pm-users" }],
            staticClass: "cpm-project-coworker",
            attrs: {
              type: "text",
              name: "user",
              placeholder: "Type 3 or more characters to search users...",
              size: "45"
            }
          })
        ]),
        _vm._v(" "),
        _c("div", { staticClass: "cpm-form-item project-notify" }, [
          _c("label", [
            _c("input", {
              directives: [
                {
                  name: "model",
                  rawName: "v-model",
                  value: _vm.project_notify,
                  expression: "project_notify"
                }
              ],
              attrs: {
                type: "checkbox",
                name: "project_notify",
                id: "project-notify",
                value: "yes"
              },
              domProps: {
                checked: Array.isArray(_vm.project_notify)
                  ? _vm._i(_vm.project_notify, "yes") > -1
                  : _vm.project_notify
              },
              on: {
                __c: function($event) {
                  var $$a = _vm.project_notify,
                    $$el = $event.target,
                    $$c = $$el.checked ? true : false
                  if (Array.isArray($$a)) {
                    var $$v = "yes",
                      $$i = _vm._i($$a, $$v)
                    if ($$el.checked) {
                      $$i < 0 && (_vm.project_notify = $$a.concat([$$v]))
                    } else {
                      $$i > -1 &&
                        (_vm.project_notify = $$a
                          .slice(0, $$i)
                          .concat($$a.slice($$i + 1)))
                    }
                  } else {
                    _vm.project_notify = $$c
                  }
                }
              }
            }),
            _vm._v("\n\t\t\t\tNotify Co-Workers            \n\t\t\t")
          ])
        ]),
        _vm._v(" "),
        _c("div", { staticClass: "submit" }, [
          _c("input", {
            attrs: { type: "hidden", name: "action", value: "cpm_project_new" }
          }),
          _vm._v(" "),
          _c("span", { staticClass: "cpm-pro-update-spinner" }),
          _vm._v(" "),
          _c("input", {
            staticClass: "button-primary",
            attrs: {
              type: "submit",
              name: "add_project",
              id: "add_project",
              value: "Add New Project"
            }
          }),
          _vm._v(" "),
          _c(
            "a",
            {
              staticClass: "button project-cancel",
              attrs: { href: "#" },
              on: {
                click: function($event) {
                  $event.preventDefault()
                  _vm.showHideProjectForm(false)
                }
              }
            },
            [_vm._v("Cancel")]
          )
        ]),
        _vm._v(" "),
        _c(
          "div",
          { staticClass: "cpm-loading", staticStyle: { display: "none" } },
          [_vm._v("Saving...")]
        )
      ]
    ),
    _vm._v(" "),
    _c(
      "div",
      {
        directives: [
          {
            name: "cpm-user-create-popup-box",
            rawName: "v-cpm-user-create-popup-box"
          }
        ],
        attrs: { id: "cpm-create-user-wrap", title: "Create a new user" }
      },
      [
        _c("project-new-user-form", {
          attrs: { project_users: _vm.project_users }
        })
      ],
      1
    )
  ])
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-792d7af7", esExports)
  }
}

/***/ }),

/***/ 106:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("div", { staticClass: "cpm-create-user-form-wrap" }, [
    _c("div", { staticClass: "cpm-error" }),
    _vm._v(" "),
    _c(
      "form",
      {
        staticClass: "cpm-user-create-form",
        attrs: { action: "" },
        on: {
          submit: function($event) {
            $event.preventDefault()
            _vm.createUser()
          }
        }
      },
      [
        _c("div", { staticClass: "cpm-field-wrap" }, [
          _c("label", [_vm._v("Username")]),
          _vm._v(" "),
          _c("input", {
            directives: [
              {
                name: "model",
                rawName: "v-model",
                value: _vm.username,
                expression: "username"
              }
            ],
            attrs: { type: "text", required: "", name: "user_name" },
            domProps: { value: _vm.username },
            on: {
              input: function($event) {
                if ($event.target.composing) {
                  return
                }
                _vm.username = $event.target.value
              }
            }
          })
        ]),
        _vm._v(" "),
        _c("div", { staticClass: "cpm-field-wrap" }, [
          _c("label", [_vm._v("First Name")]),
          _vm._v(" "),
          _c("input", {
            directives: [
              {
                name: "model",
                rawName: "v-model",
                value: _vm.first_name,
                expression: "first_name"
              }
            ],
            attrs: { type: "text", name: "first_name" },
            domProps: { value: _vm.first_name },
            on: {
              input: function($event) {
                if ($event.target.composing) {
                  return
                }
                _vm.first_name = $event.target.value
              }
            }
          })
        ]),
        _vm._v(" "),
        _c("div", { staticClass: "cpm-field-wrap" }, [
          _c("label", [_vm._v("Last Name")]),
          _vm._v(" "),
          _c("input", {
            directives: [
              {
                name: "model",
                rawName: "v-model",
                value: _vm.last_name,
                expression: "last_name"
              }
            ],
            attrs: { type: "text", name: "last_name" },
            domProps: { value: _vm.last_name },
            on: {
              input: function($event) {
                if ($event.target.composing) {
                  return
                }
                _vm.last_name = $event.target.value
              }
            }
          })
        ]),
        _vm._v(" "),
        _c("div", { staticClass: "cpm-field-wrap" }, [
          _c("label", [_vm._v("Email")]),
          _vm._v(" "),
          _c("input", {
            directives: [
              {
                name: "model",
                rawName: "v-model",
                value: _vm.email,
                expression: "email"
              }
            ],
            attrs: { type: "email", required: "", name: "email" },
            domProps: { value: _vm.email },
            on: {
              input: function($event) {
                if ($event.target.composing) {
                  return
                }
                _vm.email = $event.target.value
              }
            }
          })
        ]),
        _vm._v(" "),
        _vm._m(0)
      ]
    )
  ])
}
var staticRenderFns = [
  function() {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c("div", [
      _c("input", {
        staticClass: "button-primary",
        attrs: { type: "submit", value: "Create User", name: "create_user" }
      }),
      _vm._v(" "),
      _c("span")
    ])
  }
]
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-7bb6591b", esExports)
  }
}

/***/ }),

/***/ 110:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["a"] = ({
    props: ['total_pages', 'current_page_number', 'component_name'],

    methods: {
        pageClass: function (page) {
            if (page == this.current_page_number) {
                return 'page-numbers current';
            }

            return 'page-numbers';
        }
    }
});

/***/ }),

/***/ 111:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_pagination_vue__ = __webpack_require__(110);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_00b52034_hasScoped_false_node_modules_vue_loader_lib_selector_type_template_index_0_pagination_vue__ = __webpack_require__(112);
var disposed = false
var normalizeComponent = __webpack_require__(0)
/* script */

/* template */

/* styles */
var __vue_styles__ = null
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_pagination_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_00b52034_hasScoped_false_node_modules_vue_loader_lib_selector_type_template_index_0_pagination_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "view/assets/js/components/pagination.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] pagination.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-00b52034", Component.options)
  } else {
    hotAPI.reload("data-v-00b52034", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ 112:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _vm.total_pages > 1
    ? _c("div", [
        _c(
          "div",
          { staticClass: "cpm-pagination-wrap" },
          [
            parseInt(_vm.current_page_number) > 1
              ? _c(
                  "router-link",
                  {
                    staticClass: "cpm-pagination-btn prev page-numbers",
                    attrs: {
                      to: {
                        name: _vm.component_name,
                        params: {
                          current_page_number: _vm.current_page_number - 1
                        }
                      }
                    }
                  },
                  [_vm._v("\n\t\t\t«\n\t\t")]
                )
              : _vm._e(),
            _vm._v(" "),
            _vm._l(_vm.total_pages, function(page) {
              return _c(
                "router-link",
                {
                  key: "page",
                  class: _vm.pageClass(page) + " cpm-pagination-btn",
                  attrs: {
                    to: {
                      name: _vm.component_name,
                      params: { current_page_number: page }
                    }
                  }
                },
                [_vm._v(_vm._s(page) + "\n\t\t")]
              )
            }),
            _vm._v(" "),
            parseInt(_vm.current_page_number) < parseInt(_vm.total_pages)
              ? _c(
                  "router-link",
                  {
                    staticClass: "cpm-pagination-btn next page-numbers",
                    attrs: {
                      to: {
                        name: _vm.component_name,
                        params: {
                          current_page_number: _vm.current_page_number + 1
                        }
                      }
                    }
                  },
                  [_vm._v("\n\t\t\t»\n\t\t")]
                )
              : _vm._e()
          ],
          2
        ),
        _vm._v(" "),
        _c("div", { staticClass: "cpm-clearfix" })
      ])
    : _vm._e()
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-00b52034", esExports)
  }
}

/***/ }),

/***/ 117:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__project_new_project_btn_vue__ = __webpack_require__(128);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__project_filter_by_category_vue__ = __webpack_require__(126);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__project_search_by_client_vue__ = __webpack_require__(130);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__project_search_all_vue__ = __webpack_require__(129);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__project_header_menu_vue__ = __webpack_require__(127);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__project_view_vue__ = __webpack_require__(132);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//








/* harmony default export */ __webpack_exports__["a"] = ({
  components: {
    'project-new-project-btn': __WEBPACK_IMPORTED_MODULE_0__project_new_project_btn_vue__["a" /* default */],
    'project-filter-by-category': __WEBPACK_IMPORTED_MODULE_1__project_filter_by_category_vue__["a" /* default */],
    'project-search-by-client': __WEBPACK_IMPORTED_MODULE_2__project_search_by_client_vue__["a" /* default */],
    'project-search-all': __WEBPACK_IMPORTED_MODULE_3__project_search_all_vue__["a" /* default */],
    'project-header-menu': __WEBPACK_IMPORTED_MODULE_4__project_header_menu_vue__["a" /* default */],
    'project-view': __WEBPACK_IMPORTED_MODULE_5__project_view_vue__["a" /* default */]
  }
});

/***/ }),

/***/ 118:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["a"] = ({
    data() {
        return {
            all: '',
            active: '',
            completed: ''
        };
    },
    created() {
        var route_name = this.$route.name;

        if (route_name === 'all_projects') {
            this.all = 'active';
        } else if (route_name === 'completed_projects') {
            this.completed = 'active';
        } else {
            this.active = 'active';
        }
    }
});

/***/ }),

/***/ 119:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
//
//
//
//
//
//

var project_btn = {
	methods: {
		is_popup_active() {
			jQuery('#cpm-project-dialog').dialog("open");
			//this.$store.commit('is_popup_active', {is_active: true});
		}
	}
};

/* harmony default export */ __webpack_exports__["a"] = (project_btn);

/***/ }),

/***/ 120:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["a"] = ({
    data() {
        return {
            is_active_settings: false
        };
    },
    computed: {
        projects() {
            return this.$root.$store.state.projects;
        }
    },

    methods: {
        deleteProject(id) {
            if (!confirm('Are you sure!')) {
                return;
            }
            var self = this;
            var request_data = {
                url: self.base_url + '/cpm/v2/projects/' + id,
                type: 'DELETE',
                success: function (res) {
                    self.$root.$store.commit('afterDeleteProject', id);

                    if (!self.$root.$store.state.projects.length) {
                        self.$router.push({
                            name: 'project_lists'
                        });
                    } else {
                        self.getProjects();
                    }
                }
            };

            self.httpRequest(request_data);
        },

        settingsShowHide(project) {
            project.settings_hide = project.settings_hide ? false : true;
        }
    }
});

/***/ }),

/***/ 121:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__vue_vue__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__vue_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__vue_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__vue_vuex__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__vue_vuex___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__vue_vuex__);



/**
 * Make sure to call Vue.use(Vuex) first if using a vuex module system
 */
__WEBPACK_IMPORTED_MODULE_0__vue_vue___default.a.use(__WEBPACK_IMPORTED_MODULE_1__vue_vuex___default.a);

var Store = {
	state: {
		projects: [],
		project_users: [],
		roles: [],
		categories: [],
		total_pages: 0
	},

	mutations: {

		newProject(state, projects) {
			state.projects.push(projects.projects);
		},

		setProjectUsers(state, users) {
			if (!users.users.hasOwnProperty('roles')) {
				users.users.roles = {
					'data': {
						'id': 3,
						'title': '',
						'description': ''
					}
				};
			}
			var has_in_array = state.project_users.filter(user => {
				return user.id === users.users.id;
			});

			if (!has_in_array.length) {
				state.project_users.push(users.users);
			}
		},

		setRoles(state, roles) {
			state.roles = roles.roles;
		},

		setCategories(state, categories) {
			state.categories = categories.categories;
		},

		setPagination(state, pagination) {
			state.total_pages = pagination.pagination.total_pages;
		}
	}
};

/* harmony default export */ __webpack_exports__["a"] = (new __WEBPACK_IMPORTED_MODULE_1__vue_vuex___default.a.Store(Store));

/***/ }),

/***/ 122:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__vue_vue__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__vue_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__vue_vue__);


/***/ }),

/***/ 124:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(4)(undefined);
// imports


// module
exports.push([module.i, "\n.fa-circle {\n    margin-right: 6%;\n}\n", ""]);

// exports


/***/ }),

/***/ 125:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_header_vue__ = __webpack_require__(117);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_8596d172_hasScoped_false_node_modules_vue_loader_lib_selector_type_template_index_0_header_vue__ = __webpack_require__(138);
var disposed = false
var normalizeComponent = __webpack_require__(0)
/* script */

/* template */

/* styles */
var __vue_styles__ = null
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_header_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_8596d172_hasScoped_false_node_modules_vue_loader_lib_selector_type_template_index_0_header_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "view/assets/js/components/project-lists/header.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] header.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-8596d172", Component.options)
  } else {
    hotAPI.reload("data-v-8596d172", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ 126:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__node_modules_vue_loader_lib_template_compiler_index_id_data_v_04854266_hasScoped_false_node_modules_vue_loader_lib_selector_type_template_index_0_project_filter_by_category_vue__ = __webpack_require__(133);
var disposed = false
var normalizeComponent = __webpack_require__(0)
/* script */
var __vue_script__ = null
/* template */

/* styles */
var __vue_styles__ = null
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __vue_script__,
  __WEBPACK_IMPORTED_MODULE_0__node_modules_vue_loader_lib_template_compiler_index_id_data_v_04854266_hasScoped_false_node_modules_vue_loader_lib_selector_type_template_index_0_project_filter_by_category_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "view/assets/js/components/project-lists/project-filter-by-category.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] project-filter-by-category.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-04854266", Component.options)
  } else {
    hotAPI.reload("data-v-04854266", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ 127:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_project_header_menu_vue__ = __webpack_require__(118);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_e550a0be_hasScoped_false_node_modules_vue_loader_lib_selector_type_template_index_0_project_header_menu_vue__ = __webpack_require__(140);
var disposed = false
var normalizeComponent = __webpack_require__(0)
/* script */

/* template */

/* styles */
var __vue_styles__ = null
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_project_header_menu_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_e550a0be_hasScoped_false_node_modules_vue_loader_lib_selector_type_template_index_0_project_header_menu_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "view/assets/js/components/project-lists/project-header-menu.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] project-header-menu.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-e550a0be", Component.options)
  } else {
    hotAPI.reload("data-v-e550a0be", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ 128:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_project_new_project_btn_vue__ = __webpack_require__(119);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_b886e606_hasScoped_false_node_modules_vue_loader_lib_selector_type_template_index_0_project_new_project_btn_vue__ = __webpack_require__(139);
var disposed = false
var normalizeComponent = __webpack_require__(0)
/* script */

/* template */

/* styles */
var __vue_styles__ = null
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_project_new_project_btn_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_b886e606_hasScoped_false_node_modules_vue_loader_lib_selector_type_template_index_0_project_new_project_btn_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "view/assets/js/components/project-lists/project-new-project-btn.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] project-new-project-btn.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-b886e606", Component.options)
  } else {
    hotAPI.reload("data-v-b886e606", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ 129:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__node_modules_vue_loader_lib_template_compiler_index_id_data_v_4765212c_hasScoped_false_node_modules_vue_loader_lib_selector_type_template_index_0_project_search_all_vue__ = __webpack_require__(135);
var disposed = false
var normalizeComponent = __webpack_require__(0)
/* script */
var __vue_script__ = null
/* template */

/* styles */
var __vue_styles__ = null
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __vue_script__,
  __WEBPACK_IMPORTED_MODULE_0__node_modules_vue_loader_lib_template_compiler_index_id_data_v_4765212c_hasScoped_false_node_modules_vue_loader_lib_selector_type_template_index_0_project_search_all_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "view/assets/js/components/project-lists/project-search-all.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] project-search-all.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-4765212c", Component.options)
  } else {
    hotAPI.reload("data-v-4765212c", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ 130:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__node_modules_vue_loader_lib_template_compiler_index_id_data_v_7808e1ec_hasScoped_false_node_modules_vue_loader_lib_selector_type_template_index_0_project_search_by_client_vue__ = __webpack_require__(137);
var disposed = false
var normalizeComponent = __webpack_require__(0)
/* script */
var __vue_script__ = null
/* template */

/* styles */
var __vue_styles__ = null
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __vue_script__,
  __WEBPACK_IMPORTED_MODULE_0__node_modules_vue_loader_lib_template_compiler_index_id_data_v_7808e1ec_hasScoped_false_node_modules_vue_loader_lib_selector_type_template_index_0_project_search_by_client_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "view/assets/js/components/project-lists/project-search-by-client.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] project-search-by-client.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-7808e1ec", Component.options)
  } else {
    hotAPI.reload("data-v-7808e1ec", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ 131:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_project_summary_vue__ = __webpack_require__(120);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_20571c28_hasScoped_false_node_modules_vue_loader_lib_selector_type_template_index_0_project_summary_vue__ = __webpack_require__(134);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(141)
}
var normalizeComponent = __webpack_require__(0)
/* script */

/* template */

/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_project_summary_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_20571c28_hasScoped_false_node_modules_vue_loader_lib_selector_type_template_index_0_project_summary_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "view/assets/js/components/project-lists/project-summary.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] project-summary.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-20571c28", Component.options)
  } else {
    hotAPI.reload("data-v-20571c28", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ 132:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__node_modules_vue_loader_lib_template_compiler_index_id_data_v_72eb73da_hasScoped_false_node_modules_vue_loader_lib_selector_type_template_index_0_project_view_vue__ = __webpack_require__(136);
var disposed = false
var normalizeComponent = __webpack_require__(0)
/* script */
var __vue_script__ = null
/* template */

/* styles */
var __vue_styles__ = null
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __vue_script__,
  __WEBPACK_IMPORTED_MODULE_0__node_modules_vue_loader_lib_template_compiler_index_id_data_v_72eb73da_hasScoped_false_node_modules_vue_loader_lib_selector_type_template_index_0_project_view_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "view/assets/js/components/project-lists/project-view.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] project-view.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-72eb73da", Component.options)
  } else {
    hotAPI.reload("data-v-72eb73da", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ 133:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _vm._m(0)
}
var staticRenderFns = [
  function() {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c(
      "form",
      {
        staticClass: "cpm-project-filters",
        attrs: { action: "", method: "get", id: "cpm-project-filters" }
      },
      [
        _c("select", { attrs: { name: "project_cat", id: "project_cat" } }, [
          _c("option", { attrs: { value: "-1", selected: "selected" } }, [
            _vm._v("– Project Category –")
          ])
        ]),
        _vm._v(" "),
        _c("input", { attrs: { type: "hidden", name: "p", value: "" } }),
        _vm._v(" "),
        _c("input", { attrs: { type: "hidden", name: "status", value: "" } }),
        _vm._v(" "),
        _c("input", {
          attrs: { type: "hidden", name: "page", value: "cpm_projects" }
        }),
        _vm._v(" "),
        _c("input", {
          staticClass: " cpm-btn-submit cpm-btn-blue",
          attrs: {
            type: "submit",
            name: "submit",
            id: "project-filter-submit",
            value: "Filter"
          }
        })
      ]
    )
  }
]
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-04854266", esExports)
  }
}

/***/ }),

/***/ 134:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    _vm._l(_vm.projects, function(project) {
      return _c(
        "article",
        { staticClass: "cpm-project cpm-column-gap-left cpm-sm-col-12" },
        [
          _c(
            "router-link",
            {
              attrs: {
                title: project.title,
                to: { name: "pm_overview", params: { project_id: project.id } }
              }
            },
            [
              _c("div", { staticClass: "project_head" }, [
                _c("h5", [_vm._v(_vm._s(project.title))]),
                _vm._v(" "),
                _c("div", { staticClass: "cpm-project-detail" })
              ])
            ]
          ),
          _vm._v(" "),
          _c("div", { staticClass: "cpm-project-meta" }, [
            _c("ul", [
              _c("li", { staticClass: "message" }, [
                _c("a", {
                  attrs: {
                    title: "eirugkdj",
                    href:
                      "http://localhost/test/wp-admin/admin.php?page=cpm_projects&tab=project&action=overview&pid=60"
                  }
                }),
                _vm._v(" "),
                _c(
                  "a",
                  {
                    attrs: {
                      href:
                        "http://localhost/test/wp-admin/admin.php?page=cpm_projects&tab=message&action=index&pid=60"
                    }
                  },
                  [
                    _c("strong", [
                      _c("i", {
                        staticClass: "fa fa-circle",
                        attrs: { "aria-hidden": "true" }
                      }),
                      _vm._v(
                        _vm._s(parseInt(project.meta.total_discussion_threads))
                      )
                    ]),
                    _vm._v(" Discussions\n            \t\t\t")
                  ]
                )
              ]),
              _vm._v(" "),
              _c("li", { staticClass: "todo" }, [
                _c(
                  "a",
                  {
                    attrs: {
                      href:
                        "http://localhost/test/wp-admin/admin.php?page=cpm_projects&tab=task&action=index&pid=60"
                    }
                  },
                  [
                    _c("strong", [
                      _c("i", {
                        staticClass: "fa fa-circle",
                        attrs: { "aria-hidden": "true" }
                      }),
                      _vm._v(_vm._s(parseInt(project.meta.total_task_lists)))
                    ]),
                    _vm._v(" Task Lists\n            \t\t\t")
                  ]
                )
              ]),
              _vm._v(" "),
              _c("li", { staticClass: "files" }, [
                _c(
                  "a",
                  {
                    attrs: {
                      href:
                        "http://localhost/test/wp-admin/admin.php?page=cpm_projects&tab=files&action=index&pid=60"
                    }
                  },
                  [
                    _c("strong", [
                      _c("i", {
                        staticClass: "fa fa-circle",
                        attrs: { "aria-hidden": "true" }
                      }),
                      _vm._v(_vm._s(parseInt(project.meta.total_tasks)))
                    ]),
                    _vm._v(" Tasks\n            \t\t\t")
                  ]
                )
              ]),
              _vm._v(" "),
              _c("li", { staticClass: "milestone" }, [
                _c(
                  "a",
                  {
                    attrs: {
                      href:
                        "http://localhost/test/wp-admin/admin.php?page=cpm_projects&tab=milestone&action=index&pid=60"
                    }
                  },
                  [
                    _c("strong", [
                      _c("i", {
                        staticClass: "fa fa-circle",
                        attrs: { "aria-hidden": "true" }
                      }),
                      _vm._v(_vm._s(parseInt(project.meta.total_milestones)))
                    ]),
                    _vm._v(" Milestones\n            \t\t\t")
                  ]
                )
              ]),
              _vm._v(" "),
              _c("div", { staticClass: "clearfix" })
            ])
          ]),
          _vm._v(" "),
          _vm._m(0, true),
          _vm._v(" "),
          _c("div", { staticClass: "cpm-progress-percentage" }),
          _vm._v(" "),
          _c("footer", { staticClass: "cpm-project-people" }, [
            _c(
              "div",
              { staticClass: "cpm-scroll" },
              _vm._l(project.assignees.data, function(user) {
                return _c("img", {
                  staticClass: "avatar avatar-48 photo",
                  attrs: {
                    alt: user.display_name,
                    src: user.avatar_url,
                    height: "48",
                    width: "48"
                  }
                })
              })
            )
          ]),
          _vm._v(" "),
          _c("div", { staticClass: "cpm-project-action-icon" }, [
            _c("div", { staticClass: "cpm-project-action" }, [
              _c("span", {
                staticClass:
                  "dashicons dashicons-admin-generic cpm-settings-bind",
                on: {
                  click: function($event) {
                    $event.preventDefault()
                    _vm.settingsShowHide(project)
                  }
                }
              }),
              _vm._v(" "),
              project.settings_hide
                ? _c("ul", { staticClass: "cpm-settings" }, [
                    _c("li", [
                      _c("span", { staticClass: "cpm-spinner" }),
                      _vm._v(" "),
                      _c(
                        "a",
                        {
                          staticClass: "cpm-project-delete-link",
                          attrs: {
                            href:
                              "http://localhost/test/wp-admin/admin.php?page=cpm_projects",
                            title: "Delete project",
                            "data-confirm":
                              "Are you sure to delete this project?",
                            "data-project_id": "60"
                          },
                          on: {
                            click: function($event) {
                              $event.preventDefault()
                              _vm.deleteProject(project.id)
                            }
                          }
                        },
                        [
                          _c("span", {
                            staticClass: "dashicons dashicons-trash"
                          }),
                          _vm._v(" "),
                          _c("span", [_vm._v("Delete")])
                        ]
                      )
                    ]),
                    _vm._v(" "),
                    _c("li", [
                      _c("span", { staticClass: "cpm-spinner" }),
                      _vm._v(" "),
                      _c(
                        "a",
                        {
                          staticClass: "cpm-archive",
                          attrs: {
                            "data-type": "archive",
                            "data-project_id": "60",
                            href: "#"
                          },
                          on: {
                            click: function($event) {
                              $event.preventDefault()
                              _vm.projectComplete(project)
                            }
                          }
                        },
                        [
                          _c("span", {
                            staticClass: "dashicons dashicons-yes"
                          }),
                          _vm._v(" "),
                          _c("span", [_vm._v("Complete")])
                        ]
                      )
                    ]),
                    _vm._v(" "),
                    _vm._m(1, true)
                  ])
                : _vm._e()
            ])
          ])
        ],
        1
      )
    })
  )
}
var staticRenderFns = [
  function() {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c("div", { staticClass: "cpm-progress cpm-progress-info" }, [
      _c("div", { staticClass: "bar completed", staticStyle: { width: "50%" } })
    ])
  },
  function() {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c("li", [
      _c("span", { staticClass: "cpm-spinner" }),
      _vm._v(" "),
      _c(
        "a",
        {
          staticClass: "cpm-duplicate-project",
          attrs: {
            href: "/test/wp-admin/admin.php?page=cpm_projects",
            "data-project_id": "60"
          }
        },
        [
          _c("span", { staticClass: "dashicons dashicons-admin-page" }),
          _vm._v(" "),
          _c("span", [_vm._v("Duplicate")])
        ]
      )
    ])
  }
]
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-20571c28", esExports)
  }
}

/***/ }),

/***/ 135:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("input", {
    staticClass: "ui-autocomplete-input",
    attrs: {
      type: "text",
      id: "cpm-all-search",
      name: "searchitem",
      placeholder: "Search All...",
      value: "",
      autocomplete: "off"
    }
  })
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-4765212c", esExports)
  }
}

/***/ }),

/***/ 136:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _vm._m(0)
}
var staticRenderFns = [
  function() {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c("ul", { staticClass: "cpm-project-view " }, [
      _c("li", [
        _c(
          "a",
          {
            staticClass: "change-view",
            attrs: { href: "javascript:void(0)", dir: "list", alt: "List View" }
          },
          [_c("span", { staticClass: " dashicons dashicons-menu" })]
        )
      ]),
      _vm._v(" "),
      _c("li", [
        _c(
          "a",
          {
            staticClass: "change-view",
            attrs: { href: "javascript:void(0)", dir: "grid", alt: "Grid View" }
          },
          [
            _c("span", {
              staticClass: "active dashicons dashicons-screenoptions"
            })
          ]
        )
      ]),
      _vm._v(" "),
      _c("div", { staticClass: "clearfix" })
    ])
  }
]
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-72eb73da", esExports)
  }
}

/***/ }),

/***/ 137:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("input", {
    staticClass: "ui-autocomplete-input",
    attrs: {
      type: "text",
      id: "cpm-search-client",
      name: "searchitem",
      placeholder: "Search by Client...",
      value: "",
      autocomplete: "off"
    }
  })
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-7808e1ec", esExports)
  }
}

/***/ }),

/***/ 138:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("div", { staticClass: "cpm-top-bar cpm-no-padding" }, [
    _vm._m(0),
    _vm._v(" "),
    _c(
      "div",
      { staticClass: "cpm-row cpm-no-padding cpm-priject-search-bar" },
      [
        _c(
          "div",
          {
            staticClass: "cpm-col-3 cpm-sm-col-12 cpm-no-padding cpm-no-margin"
          },
          [_c("project-new-project-btn")],
          1
        ),
        _vm._v(" "),
        _c(
          "div",
          {
            staticClass:
              "cpm-col-9 cpm-no-padding cpm-no-margin cpm-sm-col-12  "
          },
          [
            _c(
              "div",
              { staticClass: "cpm-col-5 cpm-sm-col-12" },
              [_c("project-filter-by-category")],
              1
            ),
            _vm._v(" "),
            _c(
              "div",
              { staticClass: "cpm-col-7 cpm-sm-col-12 cpm-project-search" },
              [
                _c("project-search-by-client"),
                _vm._v(" "),
                _c("project-search-all")
              ],
              1
            )
          ]
        ),
        _vm._v(" "),
        _c("div", { staticClass: "clearfix" })
      ]
    ),
    _vm._v(" "),
    _c(
      "div",
      { staticClass: "cpm-row cpm-project-group" },
      [
        _c("project-header-menu"),
        _vm._v(" "),
        _c(
          "div",
          {
            staticClass:
              "cpm-col-4 cpm-last-col cpm-text-right show_desktop_only"
          },
          [_c("project-view")],
          1
        )
      ],
      1
    ),
    _vm._v(" "),
    _c("div", { staticClass: "clearfix" })
  ])
}
var staticRenderFns = [
  function() {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c("div", { staticClass: "cpm-row cpm-no-padding" }, [
      _c("div", { staticClass: "cpm-col-6" }, [
        _c("h3", [_vm._v("Project Manager")])
      ]),
      _vm._v(" "),
      _c("div", {
        staticClass:
          "cpm-col-6 cpm-top-right-btn cpm-text-right cpm-last-col show_desktop_only"
      }),
      _vm._v(" "),
      _c("div", { staticClass: "clearfix" })
    ])
  }
]
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-8596d172", esExports)
  }
}

/***/ }),

/***/ 139:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "a",
    {
      staticClass: "cpm-btn cpm-plus-white cpm-btn-uppercase",
      attrs: { href: "#", id: "cpm-create-project" },
      on: {
        click: function($event) {
          $event.preventDefault()
          _vm.is_popup_active()
        }
      }
    },
    [
      _c("i", {
        staticClass: "fa fa-plus-circle",
        attrs: { "aria-hidden": "true" }
      }),
      _vm._v(" New Project\n    ")
    ]
  )
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-b886e606", esExports)
  }
}

/***/ }),

/***/ 140:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "ul",
    { staticClass: "list-inline  cpm-col-8 cpm-project-group-ul" },
    [
      _c(
        "li",
        { class: _vm.all + " cpm-sm-col-4" },
        [
          _c("router-link", { attrs: { to: { name: "all_projects" } } }, [
            _vm._v("\n            All\n            "),
            _c("span", { staticClass: "count" }, [_vm._v("10")])
          ])
        ],
        1
      ),
      _vm._v(" "),
      _c(
        "li",
        { class: _vm.active + " cpm-sm-col-4" },
        [
          _c("router-link", { attrs: { to: { name: "project_lists" } } }, [
            _vm._v("\n            Active \n            "),
            _c("span", { staticClass: "count" }, [_vm._v("10")])
          ])
        ],
        1
      ),
      _vm._v(" "),
      _c(
        "li",
        { class: _vm.completed + " cpm-sm-col-4" },
        [
          _c("router-link", { attrs: { to: { name: "completed_projects" } } }, [
            _vm._v("\n            Completed \n            "),
            _c("span", { staticClass: "count" }, [_vm._v("0")])
          ])
        ],
        1
      ),
      _vm._v(" "),
      _c("div", { staticClass: "clearfix" })
    ]
  )
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-e550a0be", esExports)
  }
}

/***/ }),

/***/ 141:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(124);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(5)("073cbe70", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../../../node_modules/css-loader/index.js!../../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-20571c28\",\"scoped\":false,\"hasInlineConfig\":false}!../../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./project-summary.vue", function() {
     var newContent = require("!!../../../../../node_modules/css-loader/index.js!../../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-20571c28\",\"scoped\":false,\"hasInlineConfig\":false}!../../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./project-summary.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ 18:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_completed_projects_vue__ = __webpack_require__(186);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_65952bf6_hasScoped_false_node_modules_vue_loader_lib_selector_type_template_index_0_completed_projects_vue__ = __webpack_require__(240);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(251)
}
var normalizeComponent = __webpack_require__(0)
/* script */

/* template */

/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_completed_projects_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_65952bf6_hasScoped_false_node_modules_vue_loader_lib_selector_type_template_index_0_completed_projects_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "view/assets/js/components/project-lists/completed-projects.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] completed-projects.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-65952bf6", Component.options)
  } else {
    hotAPI.reload("data-v-65952bf6", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["default"] = (Component.exports);


/***/ }),

/***/ 186:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__directive__ = __webpack_require__(122);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__project_summary_vue__ = __webpack_require__(131);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__pagination_vue__ = __webpack_require__(111);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__project_create_form_vue__ = __webpack_require__(103);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__store__ = __webpack_require__(121);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__do_action_vue__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__header_vue__ = __webpack_require__(125);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//










/* harmony default export */ __webpack_exports__["a"] = ({
    store: __WEBPACK_IMPORTED_MODULE_4__store__["a" /* default */],

    beforeRouteEnter(to, from, next) {
        next(vm => {
            vm.getProjects(vm);
            vm.getRoles();
            vm.getProjectCategories();
        });
    },

    data() {
        return {
            current_page_number: 1
        };
    },

    watch: {
        '$route'(route) {
            this.current_page_number = route.params.current_page_number;
            this.getProjects(this);
        }
    },

    computed: {
        is_popup_active() {
            return this.$store.state.is_popup_active;
        },

        total_pages() {
            return this.$root.$store.state.project_meta.total_pages;
        }
    },

    components: {
        'project-header': __WEBPACK_IMPORTED_MODULE_6__header_vue__["a" /* default */],
        'project-summary': __WEBPACK_IMPORTED_MODULE_1__project_summary_vue__["a" /* default */],
        'pm-pagination': __WEBPACK_IMPORTED_MODULE_2__pagination_vue__["a" /* default */],
        'project-create-form': __WEBPACK_IMPORTED_MODULE_3__project_create_form_vue__["a" /* default */],
        'do-action': __WEBPACK_IMPORTED_MODULE_5__do_action_vue__["a" /* default */]
    }
});

/***/ }),

/***/ 202:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(4)(undefined);
// imports


// module
exports.push([module.i, "\n.cpm-project-meta .message .fa-circle {\n    color: #4975a8;\n}\n.cpm-project-meta .todo .fa-circle {\n    color: #68af94;\n}\n.cpm-project-meta .files .fa-circle {\n    color: #71c8cb;\n}\n.cpm-project-meta .milestone .fa-circle {\n    color: #4975a8;\n}   \n\n", ""]);

// exports


/***/ }),

/***/ 240:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    { staticClass: "wrap cpm cpm-front-end" },
    [
      _c("project-header"),
      _vm._v(" "),
      _c(
        "div",
        {
          staticClass:
            "cpm-projects cpm-row cpm-project-grid cpm-no-padding cpm-no-margin"
        },
        [
          _c("project-summary"),
          _vm._v(" "),
          _c("pm-pagination", {
            attrs: {
              total_pages: _vm.total_pages,
              current_page_number: _vm.current_page_number,
              component_name: "completed_project_pagination"
            }
          })
        ],
        1
      ),
      _vm._v(" "),
      _c(
        "div",
        {
          directives: [{ name: "pm-popup-box", rawName: "v-pm-popup-box" }],
          staticStyle: { "z-index": "999" },
          attrs: { id: "cpm-project-dialog", title: "Start a new project" }
        },
        [_c("project-create-form", { attrs: { project: {} } })],
        1
      )
    ],
    1
  )
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-65952bf6", esExports)
  }
}

/***/ }),

/***/ 251:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(202);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(5)("81b08a9a", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../../../node_modules/css-loader/index.js!../../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-65952bf6\",\"scoped\":false,\"hasInlineConfig\":false}!../../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./completed-projects.vue", function() {
     var newContent = require("!!../../../../../node_modules/css-loader/index.js!../../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-65952bf6\",\"scoped\":false,\"hasInlineConfig\":false}!../../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./completed-projects.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ })

});