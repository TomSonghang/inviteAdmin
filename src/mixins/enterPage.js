export default {
  methods: {
    enterPage(url, id, statu) {     //ε°ε,key,ηΆζ
      this.$router.push({ name: url, params: { id, statu } });
    },
  },
};
