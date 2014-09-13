(function($) {

	/** private varialbes/methods */
	var $this;
	var $settings;

	var $canvas = $(ToolbarConfig.TEMPLATE_CANVAS);
	var toolbarTemplate = ToolbarConfig.TEMPLATE_TOOLBAR;
	var toolbarGroupTemplate = ToolbarConfig.TEMPLATE_TOOLBARGROUP;
	var buttonTemplate = ToolbarConfig.TEMPLATE_BUTTON;
	var imgTemplate = ToolbarConfig.TEMPLATE_IMG;
	var $alert = $(ToolbarConfig.TEMPLATE_ALERT);
	var $modal = $(ToolbarConfig.TEMPLATE_MODAL);

	var paper;

	var stroke = ToolbarConfig.stroke;
	var fill = ToolbarConfig.fill;
	var selectedTool;
	var selectToolInstance;

	var methods = {
		init : function(options) {
			return this.each(function() {

				$this = $(this);
				me = this;

				var settings = $this.data('svgeditor');
				var defaults = {
					containerId : 'svgeditor',
					onSomeEvent : function() {
					}
				};

				if (typeof (settings) == 'undefined') {

					settings = $.extend({}, defaults, options);
					$this.data('svgeditor', settings);
				} else {
					settings = $.extend(defaults, settings, options);
				}

				buildUi($this);
			});
			return this;
		},
		destroy : function(options) {
			return $(this).each(function() {
				$this.removeData($this.settings.containerId);
			});
		}
	};

	var addElement = function(e, element) {
		element.drag(selectToolInstance.onMove, $.emptyFn, selectToolInstance.onEnd);
	};

	var buildUi = function($this) {
		initCanvas($this);
		initGrid($this);
		initToolbar($this);
	};

	var initCanvas = function($this) {
		$this.append($canvas);

		paper = Raphael($canvas.get(0), $canvas.width(), $canvas.height());
		paper.canvas.style.backgroundColor = ToolbarConfig.grid.fill;
		paper.canvas.style.opacity = ToolbarConfig.grid.opacity;

		$(window).on('resize', function(e) {
			paper.setSize($canvas.width(), $canvas.height());
		});
	};

	var initGrid = function() {

		// vertical lines
		for (var x = ($canvas.offset().left % ToolbarConfig.gridCellSize); x < $canvas.width(); x += ToolbarConfig.gridCellSize) {
			var vpath = "M " + x + " 0 l 0 " + $canvas.height() + " z";
			var path = paper.path(vpath).attr(ToolbarConfig.grid);
			$(path).on('click', function(e) {
				event.preventDefault();
			});
		}
		// horizontal lines
		for (var y = ($canvas.offset().top % ToolbarConfig.gridCellSize); y < $canvas.height(); y += ToolbarConfig.gridCellSize) {
			var hpath = "M 0 " + y + " l " + $canvas.width() + " 0 z";
			paper.path(hpath).attr(ToolbarConfig.grid);
			$(path).on('click', function(e) {
				event.preventDefault();
			});
		}
	};

	var initToolbar = function($this) {
		var $toolbar = $(toolbarTemplate);
		var options = {
			$canvas : $canvas,
			$alert : $alert,
			$modal : $modal,
			paper : paper,
			stroke : stroke,
			fill : fill,
			editor : this
		};
		selectToolInstance = new SelectTool($, options);
		addToolbarGroup($toolbar, [ selectToolInstance, new DeleteAction($, options), new ClearAction($, options) ]);
		addToolbarGroup($toolbar, [ new RectangleTool($, options), new LineTool($, options), new CircleTool($, options), new PolygonTool($, options),
				new ImageTool($, options), new TextTool($, options) ]);
		addToolbarGroup($toolbar, [ new ColorAction($, options), new StrokeAction($, options) ]);
		addToolbarGroup($toolbar, [ new ImportAction($, options), new ExportAction($, options), new SaveAction($, options) ]);
		$this.before($toolbar);
	};

	var addToolbarGroup = function($toolbar, btns) {

		var $group = $(toolbarGroupTemplate);
		for (btn in btns) {
			$group.append(buildButton(btns[btn]));
		}
		$toolbar.append($group);
	};

	var buildButton = function(btn) {
		var $button = $(buttonTemplate);

		if (btn.cls) {
			$button.addClass(btn.cls);
		}

		if (btn.title)
			$button.attr({
				title : btn.title
			});

		if (btn.text)
			$button.text(btn.text);

		if (btn.icon) {
			$button.append($(imgTemplate).attr('src', btn.icon).attr('alt', btn.title));
		}

		$button.on('click', function(e) {
			if (selectedTool) {
				selectedTool.desactivate();
			}
			selectedTool = btn;
			selectedTool.activate();
		});

		$(btn).on('svge.addElement', addElement);

		return $button;
	};

	/**
	 * Ajoute le plugin à jQuery
	 * 
	 * @param {Object}
	 *            Les paramètres passé lors de l'appel du plugin
	 */
	$.fn.svgeditor = function() {
		var method = arguments[0];

		if (methods[method]) {
			method = methods[method];
			arguments = Array.prototype.slice.call(arguments, 1);
		} else if (typeof (method) == 'object' || !method) {
			method = methods.init;
		} else {
			$.error('Method ' + method + ' does not exist on jQuery.svgeditor');
			return this;
		}

		return method.apply(this, arguments);

	};

})(jQuery);