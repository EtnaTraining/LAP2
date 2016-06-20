exports.definition = {
	config: {
		columns: {
		    "title": "text",
		    "location": "text",
		    "alarm": "boolean",
		    "duedate": "date",
			"done": "boolean",
			"filename": "text"
		},
		adapter: {
			type: "sql",
			collection_name: "todo"
		}
	},
	extendModel: function(Model) {
		_.extend(Model.prototype, {
			// extended functions and properties go here
		});

		return Model;
	},
	extendCollection: function(Collection) {
		_.extend(Collection.prototype, {
			// extended functions and properties go here

			// For Backbone v1.1.2, uncomment the following to override the
			// fetch method to account for a breaking change in Backbone.
			/*
			fetch: function(options) {
				options = options ? _.clone(options) : {};
				options.reset = true;
				return Backbone.Collection.prototype.fetch.call(this, options);
			}
			*/
		});

		return Collection;
	}
};
