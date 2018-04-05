<script>
import Vue from 'vue'
import '@/styles/ui/_notification.scss'

/*=============================================================================
  Created by NxtChg (admin@nxtchg.com), 2017. License: Public Domain.
=============================================================================*/
var VsNotify = {
 install: function(Vue) {
 	var self = this; this.g = {};

	var $notify = function(group, text, type, time){ if(self.g[group]) self.g[group](text, type, time); };

	Object.defineProperty(Vue.prototype, '$notify', { get: function(){ return $notify; } });
 }
};

Vue.use(VsNotify);

Vue.component('vs-notify', {
	template:
		'<div :class="[\'vs-notify\', group]" :style="styles"><transition-group :name="trans" mode="out-in">'+
			'<div :class="it.type" v-for="it in list" :key="it.id">'+
				'<slot name="body" :class="it.type" :item="it" :close="function(){ end(it) }">'+
					'<span @click.stop="end(it)" class="icon"><i :class="{ \'fas\': true, \'fa-exclamation-triangle\': it.type == \'ntf error\', \'fa-check\': it.type == \'ntf success\', \'fa-info-circle\': it.type == \'ntf\' }"></i></span>'+
					'<span @click.stop="end(it)" v-html="it.text"></span>'+
				'</slot>'+
			'</div>'+
		'</transition-group></div>',

	props: {
		group: String, transition: String,
		position: { type: String,  default: 'bottom right' },
		duration: { type: Number,  default: 4000 },
		reverse:  { type: Boolean, default: false }
	},

	data: function() {
		var d = !this.reverse, p = this.position, t = this.transition;

		if(p.indexOf('bottom')+1) d = !d;

		if(!t && p.indexOf('left' )+1) t = 'ntf-left';
		if(!t && p.indexOf('right')+1) t = 'ntf-right';

		return{ dir:d, trans: t, list:[] }
	},

	created: function() {
		var ids = 1, self = this;

		VsNotify.g[this.group] = function(text, type, time) {
			if(text === undefined){ self.end(); return; }

			var it = { id: ids++, text: text, type: 'ntf' + (type ? ' '+type : '') };

			time = (time !== undefined ? time : self.duration);

			if(time > 0){ it.timer = setTimeout(function(){ self.end(it); }, time); }

			self.dir ? self.list.push(it) : self.list.unshift(it);
		};
	},

	//destroyed: function(){ }, // do we need it? if so - remove group from VsNotify

	computed: {
		styles: function() {
			var s = {}, pa = this.position.split(' ');

			for(var i = 0; i < pa.length; i++) {
        if(pa[i] == 'center'){ s.left = s.right = 0; s.margin = 'auto'; } else if(pa[i] != '') s[pa[i]] = 0;
      }

			return s;
		}
	},

	methods: {
		find: function(id) { for(var i = 0; i < this.list.length; i++) if(this.list[i].id == id) return i; return -1; },

		end_no: function(n) { if(n+1){ clearTimeout(this.list[n].timer); this.list.splice(n, 1); } },

		end: function(it) {
			if(it === undefined){ while(this.list.length) this.end_no(0); return; } // kill all

			this.end_no(this.find(it.id));
		}
	}
})
</script>

<style>

</style>
