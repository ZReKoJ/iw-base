package es.ucm.fdi.iw.controller;

import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.FileReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.PrintWriter;
import java.nio.file.Files;
import java.security.Principal;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.stream.Collectors;

import javax.persistence.EntityManager;
import javax.persistence.NoResultException;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.ui.Model;
import org.springframework.util.FileCopyUtils;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;

import es.ucm.fdi.iw.LocalData;
import es.ucm.fdi.iw.model.Code;
import es.ucm.fdi.iw.model.Map;
import es.ucm.fdi.iw.model.User;

@Controller	
public class RootController{

	private static Logger log = Logger.getLogger(RootController.class);
	
	@Autowired
	private LocalData localData;
	
	@Autowired
	private PasswordEncoder passwordEncoder;
	
	@Autowired
	private EntityManager entityManager;
	
    @ModelAttribute
    public void addAttributes(Model model) {
        model.addAttribute("s", "/static");
    }
    
    @PostMapping(value = "/deleteCodes")
    @Transactional
    @ResponseBody
	public String deleteCodesHandler(@RequestParam("codes[]") ArrayList<String> codes)
    {
    	
    	for (String id : codes) {
    		Code code = entityManager.find(Code.class, Long.parseLong(id));
    		entityManager.remove(code);
    	}
    
    	 return  "/profile";
	}
    
    @PostMapping(value = "/deleteMaps")
    @Transactional
    @ResponseBody
	public String deleteMapsHandler(@RequestParam("maps[]") ArrayList<String> maps)
    {
    	
    	for (String id : maps) {
    		Map map = entityManager.find(Map.class, Long.parseLong(id));
    		entityManager.remove(map);
    	}
    
    	 return  "/profile";
	}
    
    @PostMapping(value = "/addLoss")
	@Transactional
	@ResponseBody
	public String addLossHandler(
			@RequestParam("id") long id,
			HttpSession s)
    {
    	
    	User u = entityManager.find(User.class, id);
		u.setLose(u.getLose()+1);	
		log.info("Adding a loss to " + id + ": now at " + u.getLose());
		User currentu = (User) s.getAttribute("user");
		if(id == currentu.getId()) {
			currentu.setLose(currentu.getLose()+1);
		}
		return "";
	}
    
    @PostMapping(value = "/addWin")
	@Transactional
	@ResponseBody
	public String addWinHandler(
			@RequestParam("id") long id,
			HttpSession s) 
    {
    	
    	User u = entityManager.find(User.class, id);
		u.setWin(u.getWin()+1);
		log.info("Adding a win to " + id + ": now at " + u.getLose());
		User currentu = (User) s.getAttribute("user");
		if(id == currentu.getId()) {
			currentu.setWin(currentu.getWin()+1);
		}
		return "";
	}
    
    @RequestMapping(value = "/createUser", method = RequestMethod.POST)
	@Transactional
	@ResponseBody
	public String createUser(
			@RequestParam String nickname, 
			@RequestParam String password) 
    {
    	User u;
    	try {
    		 u = entityManager.createQuery("from User where nickname = :nickname", User.class).setParameter("nickname",  nickname).getSingleResult();
    	}catch(NoResultException e) {
    		u = new User();
    		u.setNickname(nickname);
    		u.setPassword(passwordEncoder.encode(password));
    		u.setWin(0);
    		u.setLose(0);
    		u.setEnabled((byte) 0x01);
    		u.setRoles("USER");
    		
    		entityManager.persist(u);
    		entityManager.flush();
    		
    		return "login";
    	}
    	
    	return "usernametaken";
	}
    
    @RequestMapping(value = "/createCode", method=RequestMethod.POST)
    @Transactional
    @ResponseBody
    public String handleCreateCode(
    		HttpServletResponse response,
    		@RequestParam String code,
    		@RequestParam String codeFileName,
    		HttpSession s)
    {
    	response.setHeader("X-XSS-Protection", "0");
    	
		String error = "";
        if (code.isEmpty()) {
        	error = "You failed to upload a photo for " 
                + codeFileName + " because the file was empty.";     
        	log.info(error);
        } else {
        	
	    		Code codeObject= new Code();
	    		User u = (User)s.getAttribute("user");
	    		codeObject.setCreator(u);
	    		codeObject.setName(codeFileName);
	    		codeObject.setCreationTime(Calendar.getInstance().getTime());

	    		entityManager.persist(codeObject);
	    		entityManager.flush();
	    		
	    		File f = localData.getFile("codes", String.valueOf(codeObject.getId()));
	    		try (BufferedOutputStream stream = new BufferedOutputStream(new FileOutputStream(f)))
	    		{
	    			stream.write(code.getBytes());
	     
	    		} catch (Exception e) {
	    			error = "Upload failed " + codeFileName + " => " + e.getMessage();
	    		}
	  
	            return "Code uploaded";
	            
        }
        // exit with error, blame user
    	response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
        return error;
	}
    
    @RequestMapping(value="/createMap", method=RequestMethod.POST)
    @Transactional
    @ResponseBody
    public String handleCreateMap(
    		HttpServletResponse response,
    		@RequestParam String json,
    		@RequestParam String mapFileName,
    		HttpSession s)
    {

    	String error = "";
        if (json.isEmpty()) {
        	error = "You failed to upload the map";     
        	log.info(error);
        } 
        else {
        	
	    		Map map= new Map();
	    		User u = (User)s.getAttribute("user");
	    		map.setCreator(u);
	    		map.setName(mapFileName);
	    		map.setCreationTime(Calendar.getInstance().getTime());

	    		entityManager.persist(map);
	    		entityManager.flush();
	    		
	    		File f = localData.getFile("maps", String.valueOf(map.getId()));
	    		try (BufferedOutputStream stream = new BufferedOutputStream(new FileOutputStream(f)))
	    		{
	    			stream.write(json.getBytes());
	     
	    		} catch (Exception e) {
	    			error = "Upload failed " + "pruebaCanvas.png" + " => " + e.getMessage();
	    		}
	    		return "Map uploaded";
        }
      
     // exit with error, blame user
    	response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
        return error;
       
	}
    
	@GetMapping({"/", "/index"})
	public String root(Model model, Principal principal, HttpSession s) {
		
		if (s.getAttribute("user") == null) {
			s.setAttribute("user", entityManager
					.createQuery("from User where nickname = :nickname", User.class)
					.setParameter("nickname", principal.getName())
	                .getSingleResult());
				
		}
		
		return "home";
	}
	
	
	@GetMapping("/login")
	public String login() {
		return "login";
	}
	
	@GetMapping("/logout")
	public String logout() {
		return "logout";
	}
	
	@GetMapping("/upload")
	public String upload() {
		return "upload";
	}
	
	@GetMapping("/results")
	public String results() {
		return "results";
	}
	
    @RequestMapping(value = "/playing", method = RequestMethod.POST)
	public String loadPlay(
			@RequestParam String usercode,
			@RequestParam String map,
			@RequestParam ArrayList<String> enemycodes,
			Model m) {
    	
		m.addAttribute("code", usercode);
		m.addAttribute("map", map);
		m.addAttribute("enemies", enemycodes);
		
		return "playing";
	}
    
	@GetMapping("/map-design")
	public String map_design(@RequestParam(required=false) String id,
			Model m, HttpSession s) {
		if (id != null && !id.isEmpty()) {
			long uidSession = ((User) s.getAttribute("user")).getId();
			long uidParam = entityManager.find(Map.class, Long.parseLong(id)).getCreator().getId();
				
			if( uidParam == uidSession)
				m.addAttribute("mapId", id);
			else
				return "exception"; //
		}
			
		return "map-design";
	}
	
	@GetMapping("/code-design")
	public String code_design(@RequestParam(required=false) String id,
			Model m, HttpSession s) {
		if (id != null && !id.isEmpty()) {
			long uidSession = ((User) s.getAttribute("user")).getId();
			long uidParam = entityManager.find(Code.class, Long.parseLong(id)).getCreator().getId();
			
			if( uidParam == uidSession)
				m.addAttribute("codeId", id);
			else
				return "exception";
		}
		return "code-design";
	}
	
	@GetMapping("/play")
	public String play(Model m, HttpSession s) {
		
		List<Map> maps = entityManager.createQuery("from Map", Map.class).getResultList();
		m.addAttribute("maps", maps);
		
		List<Code> codes = entityManager.createQuery("from Code", Code.class).getResultList();
		m.addAttribute("codes", codes);
		
		User u = (User) s.getAttribute("user");
		m.addAttribute("ownedCodes", entityManager
						.createQuery("from Code where creator = :id", Code.class)
			            .setParameter("id",  u).getResultList());
			
		return "play";
	}
	
	@GetMapping("/profile")
	public String profile(HttpServletRequest request, HttpSession s, Model m) {
		
		User u = (User) s.getAttribute("user");
		u = entityManager.find(User.class, u.getId());
		s.setAttribute("user", u);
		
		List<Code> myCodes = entityManager
				.createQuery("from Code where creator = :nickname", Code.class)
				.setParameter("nickname", u)
                .getResultList();
		List<Map> myMaps = entityManager
				.createQuery("from Map where creator = :nickname", Map.class)
				.setParameter("nickname", u)
                .getResultList();
		
		m.addAttribute("myCodes", myCodes);
		m.addAttribute("myMaps", myMaps);
		m.addAttribute("myCodesSize", myCodes.size());
		m.addAttribute("myMapsSize", myMaps.size());

		m.addAttribute("endpoint", request.getRequestURL().toString()
				.replaceFirst("[^:]*", "ws")
				.replace("profile", "chatsocket"));
		
		return "profile";
	}
	
	@GetMapping("/exception")
	public String settings() {
		return "exception";
	}
	
	@GetMapping("/ranking")
	public String ranking(Model m) {
		
		List<User> users = entityManager.createQuery("from User", User.class).getResultList();
		Collections.sort(users, new Comparator<User>() {

			@Override
			public int compare(User user1, User user2) {
				return (user1.getWin() > user2.getWin()) ? -1 : (user1.getLose() < user2.getLose()) ? 1 : 0;
			}
			
		});
		m.addAttribute("users", users);
	
		return "ranking";
	}
	
	@GetMapping("/loadMap/{id}")
	@ResponseBody
	public String loadMap(@PathVariable("id") String id, 
			HttpServletRequest request, 
			HttpServletResponse response) 
	throws ServletException, IOException
	{
		return new String(Files
				.readAllBytes(localData.getFile("maps", id)
						.toPath()),
				"UTF-8");
	}
	
	@GetMapping("/loadCode/{id}")
	@ResponseBody
	public String loadCode(@PathVariable("id") String id, 
			HttpServletRequest request,HttpServletResponse response) 
	throws ServletException, IOException  
	{
		return new String(Files
				.readAllBytes(localData.getFile("codes", id)
						.toPath()),
				"UTF-8");
	}
	
	@RequestMapping(value="/saveAvatar", method=RequestMethod.POST)
	public String handleFileUpload(
			@RequestParam MultipartFile photo, 
			HttpSession s)
	{
		String error = "";
		if (photo.isEmpty()) {
			error = "Empty file uploading photo";
			log.error(error);
		} else {
			String id = "" + ((User)s.getAttribute("user")).getId();
			File f = localData.getFile("users/" + id,"avatar");
			try (BufferedOutputStream stream = new BufferedOutputStream(new FileOutputStream(f))) {
				stream.write(photo.getBytes());
			} catch (Exception e) {
				error = "Upload failed " + s.getAttribute("user").toString() + " => " + e.getMessage();
				log.error(error);
			}
		}

		    return  "redirect:/profile";
	}
	

	@RequestMapping(value="/avatar/{id}", 		
			produces = MediaType.IMAGE_JPEG_VALUE)
	public void userPhoto(@PathVariable("id") String id, 
			HttpServletResponse response) {
	    File f = localData.getFile("users/" + id, "avatar");
	    try (InputStream in = f.exists() ? 
		    	new BufferedInputStream(new FileInputStream(f)) :
		    	new BufferedInputStream(this.getClass().getClassLoader()
		    			.getResourceAsStream("static/img/avatar.png"))) {
	    	FileCopyUtils.copy(in, response.getOutputStream());
	    } catch (IOException ioe) {
	    	response.setStatus(HttpServletResponse.SC_NOT_FOUND); // 404
	    	log.info("Error retrieving file: " + f + " -- " + ioe.getMessage());
	    }
	}
	
}