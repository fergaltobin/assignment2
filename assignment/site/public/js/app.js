function pd( func ) {
  return function( event ) {
    event.preventDefault()
    func && func(event)
  }
}

document.ontouchmove = pd()

_.templateSettings = {
  interpolate: /\{\{(.+?)\}\}/g,
  escape:      /\{\{-(.+?)\}\}/g,
  evaluate:    /\{\{=(.+?)\}\}/g
};

var AppRouter = Backbone.Router.extend({
	routes : {
		'cowdetail': 'showCowInfo',
		'todoPage': 'showToDoList',
	},

	showCowInfo : function() { 
	    var self = this
		_.bindAll(self)
        
		},
	
	showToDoList : function() { 
	    var self = this
		_.bindAll(self)
		},
})

var i = 0

var app = {
  model: {},
  view: {},
  tabs: {
    home:    { index:i++, icon:'FarmerSmall', },
    cows:  { index:i++, icon:'CowHeadSmall', },
    calfs:   { index:i++, icon:'calfSmall', },
    calfsSold:  { index:i++, icon:'soldsmall', },
      },
  platform: /Android/.test(navigator.userAgent)?'android':'ios',
  initialtab: 'home'
}

console.log(app)


var bb = {
  model: {},
  view: {},
  social: [{name:'twitter'},{name:'facebook'}]
}


bb.init = function() {

    
  bb.model.State = Backbone.Model.extend({    
    defaults: {
      current: 'none'
    },
    
  })
  
  var scrollContent = {
    scroll: function() {
      var self = this
      setTimeout( function() {
        if( self.scroller ) {
          self.scroller.refresh()
        } else {
          self.scroller = new iScroll( $("div[data-role='content']")[0] )
        }
      },1)
    }}

bb.model.Item = Backbone.Model.extend(_.extend({    
    defaults: {
      text: '',
      breedAnimal: '',
      dateOfAI: '',
      calf: '',
      calfin: '',
      siret: '',
     },
    initialize: function() {
      var self = this
      _.bindAll(self)
    },
		
		toggle : function() {
			this.save({
				checked : !this.get("checked")
				
			});
		}

  }))  
  
bb.model.Items = Backbone.Collection.extend(_.extend({    
    model: bb.model.Item,
	url: '/api/rest/todo',

    initialize: function() {
      var self = this
      _.bindAll(self)
      self.count = 0
      self.on('reset',function() {
        self.count = self.length
      })
    },

	additem: function(text, siret, date, breedtxt, calfin, calf) {
      var self = this
      var item = new bb.model.Item({
        text : text,
	breedAnimal : breedtxt,
	dateOfAI : date,
	siret : siret,
	calfin: calfin,
	calf : calf,
			
      })
      self.count++
	  self.add(item)
      item.save() 
	}

  }))

     bb.view.Head = Backbone.View.extend(_.extend({    
    events: {
		'tap #cancel': function(){ 
		var self = this
		_.bindAll(self)
		self.hideAddItem()
		},
		
		'tap #add': function(){ 
		var self = this
		_.bindAll(self)
		self.setElement("div[id='main']")
		self.elem = {
		
			add : self.$el.find('#add'),
			cancel : self.$el.find('#cancel'),
			newitem : self.$el.find('#newitem'),
			siretext : self.$el.find('#siretext'),
			dateAI : self.$el.find('#dateAI'),
			breed : self.$el.find('#breed'),
			inCalf : self.$el.find('#inCalf'),
			calfed : self.$el.find('#calfed'),
			newitemtext : self.$el.find('#newitemtext'),
			save : self.$el.find('#save'),
			
			}
			
		self.showAddItem()
		},
	         'tap #inCalf' : function() {
			var self = this
			_.bindAll(self)
			$('#inCalf').focus();
		},
		
		'tap #calfed' : function() {
			var self = this
			_.bindAll(self)
			$('#calfed').focus();
		},
				
		'tap #newitemtext' : function() {
			var self = this
			_.bindAll(self)
			$('#newitemtext').focus();
		},
		
		'tap #siretext' : function() {
			var self = this
			_.bindAll(self)
			$('#siretext').focus();
		},
		
		'tap #dateAI' : function() {
			var self = this
			_.bindAll(self)
			$('#dateAI').focus();
		},
		
		'tap #breed' : function() {
			var self = this
			_.bindAll(self)
			$('#breed').focus();
		},
		
		'tap #save' : function() {
			var self = this
				_.bindAll(self)
			self.setElement("div[id='main']")
			self.elem = {
				newitemtext : self.$el.find('#newitemtext'),
				add : self.$el.find('#add'),
				cancel : self.$el.find('cancel'),
				siretext : self.$el.find('#siretext'),
			        dateAI : self.$el.find('#dateAI'),
			        breed : self.$el.find('#breed'),
				calfed : self.$el.find('#calfed'),
				inCalf : self.$el.find('#inCalf'),
				newitem : self.$el.find('#newitem')
				
			}
		var text = self.elem.newitemtext.val()
		var siret = self.elem.siretext.val()
		var date = self.elem.dateAI.val()
		var breedtxt = self.elem.breed.val()
		var calfin = self.elem.inCalf.val()
		var calf = self.elem.calfed.val()
				
		if(0 == text.length) {
			return
			}
		self.items.additem(text, siret, date, breedtxt, calfin, calf)
		self.hideAddItem()
		},
		
		'tabchange #tab_home': function(){ 
		var self = this
		_.bindAll(self)
		self.hideAddButton()
		}
    },

    initialize: function( items ) {
		var self = this
		_.bindAll(self)
		self.items = items
		self.setElement("div[data-role='header']")
		self.elem = {
			add: self.$el.find('#add'),
			title: self.$el.find('h1')
      }
      
		self.tm = {
			title: _.template( self.elem.title.html() )
      }

    },

    render: function() {
	
      var self = this
      _.bindAll(self)
      self.setElement("div[data-role='header']")      
	  			self.elem = {
				add : self.$el.find('#add'),
				title : self.$el.find('#titlebar')
			}
      var loaded = 'loaded' == app.model.state.get('items')
      self.elem.title.html( self.tm.title({
        title: loaded ? self.items.length+' Items' : 'Loading...'
      }) )

      if( loaded ) {
        self.elem.add.show()
      }
    },
	
	showAddItem: function(){
		$('#add').hide();
		$('#cancel').show();
		$('#newitem').slideDown();
		$('#newitemtext').focus();
	},

	hideAddItem: function(){
		$('#add').show();
		$('#cancel').hide();
		$('#newitem').slideUp();
		$('#newitemtext').val('').blur()	
	},
	
	hideAddButton: function (){
		$('#add').hide()
	},
	
	
}))
  
  bb.view.Navigation = Backbone.View.extend({    
    initialize: function( items ) {
      var self = this
      _.bindAll(self)

      self.elem = {
        header: $("#header"),
        footer: $("#footer")
      }

      self.elem.header.css({zIndex:1000})
      self.elem.footer.css({zIndex:1000})

      function handletab(tabname) {
        return function(){
          app.model.state.set({current:tabname})
        }
      }

      var tabindex = 0
      for( var tabname in app.tabs ) {
        console.log(tabname)
        $("#tab_"+tabname).tap(handletab(tabname))
      }

      app.scrollheight = window.innerHeight - self.elem.header.height() - self.elem.footer.height()
      if( 'android' == app.platform ) {
        app.scrollheight += self.elem.header.height()
      }
    },

    render: function() {
    }
  })


  bb.view.Content = Backbone.View.extend({    
    initialize: function( initialtab ) {
      var self = this
      _.bindAll(self)

      self.current = initialtab
      self.scrollers = {}

      app.model.state.on('change:current',self.tabchange)

      window.onresize = function() {
        self.render()
      }

      app.model.state.on('scroll-refresh',function(){
        self.render()
      })
    },

    render: function() {
      var self = this

      app.view[self.current] && app.view[self.current].render()

      var content = $("#content_"+self.current)
      if( !self.scrollers[self.current] ) {
        self.scrollers[self.current] = new iScroll("content_"+self.current)      
      }

      content.height( app.scrollheight ) 

      setTimeout( function() {
        self.scrollers[self.current].refresh()
      },300 )
    },

    tabchange: function() {
      var self = this

      var previous = self.current
      var current = app.model.state.get('current')
      console.log( 'tabchange prev='+previous+' cur='+current)

      $("#content_"+previous).hide().removeClass('leftin').removeClass('rightin')
      $("#content_"+current).show().addClass( app.tabs[previous].index <= app.tabs[current].index ?'leftin':'rightin')
      self.current = current

      self.render()
    }
  })


  bb.view.home = Backbone.View.extend({
   
  })



  bb.view.List = Backbone.View.extend(_.extend({    
    initialize: function( items ) {
    var self = this
    _.bindAll(self)
    self.setElement('#list')
    self.items = items
    self.items.on('destroy',self.render)
	self.items.on('sync', self.appenditem)	
	self.items.on('fetch',self.render)
    },


    render: function() {
      var self = this
      self.$el.empty()
      self.items.each(function(item){
        self.appenditem(item)
		})
		return this;
	},


    appenditem: function(item) {
      var self = this
      var itemview = new bb.view.Item({
        model: item
      })    
	  self.$el.append(itemview.el)
	  self.scroll()
    }

  },scrollContent))

  bb.view.Item = Backbone.View.extend(_.extend({    
    events: {
		'tap #cowInfo' : function(){
			app.myToDoRouter.navigate("cow_info")
		},
		
		'tap .delete-item' : function() {
		var self = this
		_.bindAll(self)
		var itemdata = self.model.attributes
		self.model.destroy()
		},

		'swiperight .tm' : function() {
			var self = this
			_.bindAll(self)
			var itemdata = self.model.attributes
			app.model.items.each(function(item){
				$('#rm_' + item.attributes.id).hide()
			})
			$('#rm_' + itemdata.id).show()
		},
		'swipeleft .tm' : function() {
			var self = this
			_.bindAll(self)
			var itemdata = self.model.attributes
			$('#rm_' + itemdata.id).hide()
		},
		'tap .check' : function() {
			var self = this
			_.bindAll(self)
			var itemdata = self.model.attributes
			self.model.toggle()
			app.markitem(self.$el, self.model.attributes.checked)
		}
    },

    initialize: function() {
      var self = this
      _.bindAll(self)
      self.render()
    },

	render: function() {
      var self = this
      var html = self.tm.item( self.model.toJSON() )
      self.$el.append( html ) 
	  app.markitem(self.$el, self.model.attributes.done)
    }
  },{
    tm: {
      item: _.template( $('#list').html() )
    }
  }))


  bb.view.calfs = Backbone.View.extend({
    initialize: function() {
      var self = this
      _.bindAll(self)

      self.elem = {
      }
      
    },
    
    render: function() {
    }
  })

  bb.view.calfsSold = Backbone.View.extend({
    initialize: function() {
      var self = this
      _.bindAll(self)

      self.elem = {
      }
    },
    render: function() {
    }
  })
  
  bb.view.CalfHead = Backbone.View.extend(_.extend({    
    events: {
		'tap #cancelCalf': function(){ 
		var self = this
		_.bindAll(self)
		self.hideAddCalf()
		},
		
		'tap #addCalf': function(){ 
		var self = this
		_.bindAll(self)
		self.setElement("div[id='main']")
		self.elem = {
		
			addCalf : self.$el.find('#addCalf'),
			cancel : self.$el.find('#cancelCalf'),
			newCalf : self.$el.find('#newCalf'),
			siret : self.$el.find('#siret'),
			birthDate : self.$el.find('#birthDate'),
			calfBreed : self.$el.find('#calfBreed'),
			gender : self.$el.find('#gender'),
			newTag : self.$el.find('#newTag'),
			cowTag : self.$el.find('#cowTag'),
			save : self.$el.find('#saveCalf'),
			
			}
			
		self.showAddCalf()
		},
	         'tap #gender' : function() {
			var self = this
			_.bindAll(self)
			$('#gender').focus();
		},
		
		'tap #cowTag' : function() {
			var self = this
			_.bindAll(self)
			$('#cowTag').focus();
		},
				
		'tap #newCalf' : function() {
			var self = this
			_.bindAll(self)
			$('#newCalf').focus();
		},
		
		'tap #siret' : function() {
			var self = this
			_.bindAll(self)
			$('#siret').focus();
		},
		
		'tap #birthDate' : function() {
			var self = this
			_.bindAll(self)
			$('#birthDate').focus();
		},
		
		'tap #calfBreed' : function() {
			var self = this
			_.bindAll(self)
			$('#calfBreed').focus();
		},
		
		'tap #saveCalf' : function() {
			var self = this
				_.bindAll(self)
			self.setElement("div[id='main']")
			self.elem = {
				newTag : self.$el.find('#newTag'),
				addCalf : self.$el.find('#addCalf'),
				cancelCalf : self.$el.find('#cancelCalf'),
				siret : self.$el.find('#siret'),
			        birthDate : self.$el.find('#birthDate'),
			        calfBreed : self.$el.find('#calfBreed'),
				cowTag : self.$el.find('#cowTag'),
				gender : self.$el.find('#gender'),
				newCalf : self.$el.find('#newCalf')
				
			}
		var text = self.elem.newTag.val()
		var siret = self.elem.siret.val()
		var dateBirth = self.elem.birthDate.val()
		var breedCalf = self.elem.calfBreed.val()
		var cowTag = self.elem.cowTag.val()
		var gender = self.elem.gender.val()
				
		if(0 == text.length) {
			return
			}
		self.calfs.addcalf(text, siret, dateBirth, breedCalf, cowTag, gender)
		self.hideAddCalf()
		},
		
		'tabchange #tab_home': function(){ 
		var self = this
		_.bindAll(self)
		self.hideAddCalfButton()
		}
    },

    initialize: function( calfs ) {
		var self = this
		_.bindAll(self)
		self.calfs = calfs
		self.setElement("div[data-role='header']")
		self.elem = {
			addCalf: self.$el.find('#addCalf'),
			title: self.$el.find('h1')
      }
      
		self.tm = {
			title: _.template( self.elem.title.html() )
      }

    },

    render: function() {
	
      var self = this
      _.bindAll(self)
      self.setElement("div[data-role='header']")      
	  			self.elem = {
				addCalf : self.$el.find('#addCalf'),
				title : self.$el.find('#titlebar')
			}
      var loaded = 'loaded' == app.model.state.get('calfs')
      self.elem.title.html( self.tm.title({
        title: loaded ? self.calfs.length+' Calfs' : 'Loading...'
      }) )

          
      if( loaded ) {
        self.elem.add.show()
      }
    },
	
	showAddCalf: function(){
		$('#addCalf').hide();
		$('#cancelCalf').show();
		$('#newCalf').slideDown();
		$('#newTag').focus();
	},

	hideAddCalf: function(){
		$('#addCalf').show();
		$('#cancelCalf').hide();
		$('#newCalf').slideUp();
		$('#newTag').val('').blur()	
	},
	
	hideAddCalfButton: function (){
		$('#addCalf').hide()
	},
	
	
}))
  
   bb.model.calf = Backbone.Model.extend(_.extend({    
    defaults: {
      text: '',
      breedAnimal: '',
      dateOfBirth: '',
      gender: '',
      mothertag: '',
      siret: '',

     },
    initialize: function() {
      var self = this
      _.bindAll(self)
    },
		
		toggle : function() {
			this.save({
				checked : !this.get("checked")
				
			});
		}

  }))
  
  
  bb.model.Calfs = Backbone.Collection.extend(_.extend({    
    model: bb.model.calf,
	url: '/api/rest/calf',

    initialize: function() {
      var self = this
      _.bindAll(self)
      self.count = 0
      self.on('reset',function() {
        self.count = self.length
      })
    },

	addcalf: function(text, siret, dateBirth, breedCalf, cowTag, gender) {
      var self = this
      var calfdetail = new bb.model.calf({
        text: text,
      breedAnimal: breedCalf,
      dateOfBirth: dateBirth,
      mothertag: cowTag,
      gender: gender,
	siret: siret,
		
      })
      self.count++
	  self.add(calfdetail)
      calfdetail.save() 
	}

  }))
  
  bb.view.calfList = Backbone.View.extend(_.extend({    
    initialize: function( items ) {
    var self = this
    _.bindAll(self)
    self.setElement('#listcalf')
    self.items = items
    self.items.on('destroy',self.render)
	self.items.on('sync', self.appenditem)	
	self.items.on('fetch',self.render)
    },


    render: function() {
      var self = this
      self.$el.empty()
      self.items.each(function(item){
        self.appenditem(item)
		})
		return this;
	},


    appenditem: function(item) {
      var self = this
      var itemview = new bb.view.Item({
        model: item
      })    
	  self.$el.append(itemview.el)
	  self.scroll()
    }

  },scrollContent))

  bb.view.calf = Backbone.View.extend(_.extend({    
        events: {
		'tap #cowInfo' : function(){
			app.myToDoRouter.navigate("cow_info")
		},
		
		'tap .delete-item' : function() {
		var self = this
		_.bindAll(self)
		var itemdata = self.model.attributes
		self.model.destroy()
		},

		'swiperight .tm' : function() {
			var self = this
			_.bindAll(self)
			var itemdata = self.model.attributes
			app.model.items.each(function(item){
				$('#rm_' + item.attributes.id).hide()
			})
			$('#rm_' + itemdata.id).show()
		},
		'swipeleft .tm' : function() {
			var self = this
			_.bindAll(self)
			var itemdata = self.model.attributes
			$('#rm_' + itemdata.id).hide()
		},
		'tap .check' : function() {
			var self = this
			_.bindAll(self)
			var itemdata = self.model.attributes
			self.model.toggle()
			app.markitem(self.$el, self.model.attributes.checked)
		}
    },

    initialize: function() {
      var self = this
      _.bindAll(self)
      self.render()
    },

	render: function() {
      var self = this
      var html = self.tm.item( self.model.toJSON() )
      self.$el.append( html ) 
	  app.markitem(self.$el, self.model.attributes.done)
    }
  },{
    tm: {
      item: _.template( $('#listcalf').html() )
    }
  }))
  
  bb.view.SocialMsg = Backbone.View.extend({
		initialize : function(items) {
			var self = this
			_.bindAll(self)

			self.elem = {
				msg : {}
			}
			app.social.forEach(function(service) {
				self.elem.msg[service.name] = $('#social_msg_' + service.name)
				self.elem.msg[service.name].tap(function() {
					self.socialmsg(service)
				})
			})

			app.model.state.on('change:user', self.render)

		},
		render : function() {
			var self = this

			var user = app.model.state.get('user')
			console.log('user is ' + user)
		},
		socialmsg : function(service) {
			console.log('tapped ' + service.name)

			var currentTime = new Date();

			http.post('/user/socialmsg/' + currentTime, {}, function(res) {
				alert(res.ok ? 'Message sent!' : 'Unable to send message.')
			})
		}
	})
  
  
  bb.view.cowdetail = Backbone.View.extend()
  

}

app.init_browser = function() {
  if( browser.android ) {
    $("#main div[data-role='content']").css({
      bottom: 0
    })
  }
}

app.markitem = function(item, checked) {
	item.find('span.check').html( checked ? '*' : '&nbsp;')
	item.find('span.text').css({
		'text-decoration' : checked ? 'line-through' : 'none'
	})
}
app.boot = function() {
  document.ontouchmove = function(e){ e.preventDefault(); }
  $( '#main' ).live( 'pagebeforecreate',function(){
    app.boot_platform()
  })
}

app.boot_platform = function() {
  if( 'android' == app.platform ) {
    $('#header').hide()
    $('#footer').attr({'data-role':'header'})
    $('#content').css({'margin-top':59})
  }
}

app.init_platform = function() {
  if( 'android' == app.platform ) {
    $('li span.ui-icon').css({'margin-top':-4})
  }
}

app.start = function() {
  $("#tab_"+app.initialtab).tap()
}

app.erroralert = function( error ) {
  alert(error)
}


app.init = function() {
  console.log('start init')

  app.init_platform()

  bb.init()

  app.model.state = new bb.model.State()
  app.model.items = new bb.model.Items()
  app.model.calfs = new bb.model.Calfs()
  
  app.view.head = new bb.view.Head(app.model.items)
  app.view.head.render()
  
  app.view.calfhead = new bb.view.CalfHead(app.model.calfs)
  app.view.calfhead.render()
  
  app.view.list = new bb.view.List(app.model.items)
  app.view.list.render()
  
  app.view.calflist = new bb.view.calfList(app.model.calfs)
  app.view.calflist.render()
  
  app.view.navigation = new bb.view.Navigation(app.initialtab)
  app.view.navigation.render()

  app.view.content = new bb.view.Content(app.initialtab)
  app.view.content.render()
  
 
// app.view.socialmsg = new bb.view.SocialMsg()
  //app.view.socialmsg.render()
  

   
  app.view.home    = new bb.view.home()
  /*app.view.cows  = new bb.view.cows()*/
  /*app.view.calfs   = new bb.view.calfs()*/
  app.view.calfsSold  = new bb.view.calfsSold()
  
  
  app.myToDoRouter = new AppRouter();

  app.model.items.fetch( {
    success: function() {
      app.model.state.set({items:'loaded'})
      app.view.list.render()
    }
  })
  
  app.model.calfs.fetch( {
    success: function() {
      app.model.state.set({calfs:'loaded'})
      app.view.calflist.render()
    }
  })
  
  app.start()

  console.log('end init')
}


app.boot()
$(app.init)
